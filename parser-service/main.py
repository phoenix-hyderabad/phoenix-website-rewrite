from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import uuid
import tempfile
import fitz  # PyMuPDF
import concurrent.futures
from supabase import create_client, Client
from pydantic import BaseModel

app = FastAPI(title="Phoenix Mock OA Parser Service")

# Allow CORS for local development and Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TABLE_NAME = "phoenix-website_mock_oa"
BUCKET_NAME = "mock_images"

# Regex patterns
QUESTION_START_REGEX = re.compile(
    r"^\s*(Q(?:uestion)?\s*\.?\s*\d+|\d+)\s*[)\.:-]\s+(.*)", 
    re.IGNORECASE | re.DOTALL
)

OPTIONS_REGEXES = [
    re.compile(r"(?:^|\s)\(([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s\([A-Ea-e1-5]\))|$)", re.DOTALL),
    re.compile(r"(?:^|\s)([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s[A-Ea-e1-5]\))|$)", re.DOTALL),
    re.compile(r"(?:^|\s)([A-Ea-e1-5])\.\s*(.+?)(?=(?:\s[A-Ea-e1-5]\.)|$)", re.DOTALL),
    re.compile(r"(?:^|\s)\[([A-Ea-e1-5])\]\s*(.+?)(?=(?:\s\[[A-Ea-e1-5]\])|$)", re.DOTALL),
]

def get_supabase_client() -> Client:
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Missing Supabase credentials in service environment.")
    return create_client(url, key)

def setup_storage(supabase: Client):
    try:
        buckets = supabase.storage.list_buckets()
        if BUCKET_NAME not in [b.name for b in buckets]:
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
    except Exception as e:
        print(f"[warn] Storage setup issue: {e}")

def parse_options(text: str):
    for pattern in OPTIONS_REGEXES:
        matches = pattern.findall(text)
        if len(matches) >= 2:
            options = {}
            for i, match in enumerate(matches[:4]):
                options[f"option{i+1}"] = match[1].strip()
            return options
    return None

def clean_question_text(text: str):
    split_pattern = r"(?:\n|\s|^)\([A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\.\s*|(?:\n|\s|^)\[[A-Ea-e1-5]\]\s*"
    parts = re.split(split_pattern, text, maxsplit=1)
    if parts and len(parts[0].strip()) > 5:
        return parts[0].strip()
    return text.strip()

def extract_questions_from_pdf(pdf_path: str):
    doc = fitz.open(pdf_path)
    questions = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Images
        page_images = []
        for img_info in page.get_images(full=True):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            rects = page.get_image_rects(xref)
            if rects:
                y_center = (rects[0].y0 + rects[0].y1) / 2
                page_images.append({
                    "bytes": base_image["image"],
                    "ext": base_image["ext"],
                    "y": y_center
                })
        
        # Text blocks
        text_blocks = []
        for b in page.get_text("dict")["blocks"]:
            if b["type"] == 0:
                text = "".join(span["text"] + " " for line in b["lines"] for span in line["spans"]).strip()
                if text:
                    text_blocks.append({"text": text, "y": b["bbox"][1]})
        
        current_q = None
        for tb in text_blocks:
            match = QUESTION_START_REGEX.match(tb["text"])
            if match:
                if current_q and len(current_q["text"]) > 10:
                    questions.append(current_q)
                current_q = {
                    "text": match.group(2).strip(),
                    "y_start": tb["y"],
                    "page": page_num,
                    "image_bytes": None,
                    "image_ext": None
                }
            elif current_q:
                current_q["text"] += "\n" + tb["text"]
                
        if current_q and len(current_q["text"]) > 10:
            questions.append(current_q)
            
        # Associate images spatially
        page_qs = [q for q in questions if q.get("page") == page_num]
        for img in page_images:
            best_q = None
            min_dist = float('inf')
            for q in page_qs:
                if q["y_start"] <= img["y"] + 50:
                    dist = img["y"] - q["y_start"]
                    if dist >= -50 and dist < min_dist:
                        min_dist = dist
                        best_q = q
            
            if best_q and not best_q["image_bytes"]:
                best_q["image_bytes"] = img["bytes"]
                best_q["image_ext"] = img["ext"]

    doc.close()
    return questions

def process_single_question(q, domain, supabase: Client):
    text = q["text"].strip()
    if len(text) < 10:
        return False

    opts = parse_options(text)
    clean_txt = clean_question_text(text) if opts else text
    clean_txt = clean_txt.replace("\n", " ").strip()
    
    row = {
        "qtext": clean_txt,
        "qimage": None,
        "type": "mcq",
        "section": domain,
        "option1": opts["option1"] if opts else None,
        "option2": opts["option2"] if opts else None,
        "option3": opts["option3"] if opts else None,
        "option4": opts["option4"] if opts else None,
        "correctans": None,
    }

    # Handle Image Upload
    if q.get("image_bytes"):
        filename = f"qimg_{uuid.uuid4().hex}.{q['image_ext']}"
        try:
            supabase.storage.from_(BUCKET_NAME).upload(
                path=filename, 
                file=q["image_bytes"], 
                file_options={"content-type": f"image/{q['image_ext']}"}
            )
            row["qimage"] = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        except Exception as e:
            print(f"Image upload error: {e}")

    # Insert to DB
    try:
        result = supabase.table(TABLE_NAME).insert(row).execute()
        if result.data:
            return True
    except Exception as e:
        print(f"Database insert error: {e}")
        
    return False

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Phoenix PDF Parser"}

@app.post("/parse")
async def parse_and_upload(
    file: UploadFile = File(...),
    domain: str = Form(...)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")

    supabase = get_supabase_client()
    setup_storage(supabase)
    
    # Save uploaded file to a temporary file
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save temp file: {e}")

    try:
        questions = extract_questions_from_pdf(tmp_path)
        
        uploaded_count = 0
        
        # Concurrently process questions to drastically increase upload speed
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(process_single_question, q, domain, supabase) for q in questions]
            
            for future in concurrent.futures.as_completed(futures):
                if future.result():
                    uploaded_count += 1

        return {
            "success": True,
            "message": f"Successfully parsed and uploaded {uploaded_count} questions via Python service.",
            "count": uploaded_count
        }

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
