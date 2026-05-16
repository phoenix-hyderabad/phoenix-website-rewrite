#!/usr/bin/env python3
"""
auto_pdf_parser.py
==================
Advanced automated PDF parser that extracts text AND images, maps images to 
questions using spatial coordinates, uploads images to Supabase Storage, and 
inserts the structured data into the database.

Usage:
    python auto_pdf_parser.py --pdf path/to/exam.pdf --section "Analog Electronics"

Requirements:
    pip install PyMuPDF supabase python-dotenv
"""

import os
import sys
import re
import argparse
import uuid
import fitz  # PyMuPDF
from pathlib import Path

# Load .env
try:
    from dotenv import load_dotenv
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent.parent.parent.parent.parent
    env_file = project_root / ".env"
    if env_file.exists():
        load_dotenv(env_file)
    else:
        load_dotenv()
except ImportError:
    print("[warn] python-dotenv not installed.")

try:
    from supabase import create_client, Client
except ImportError:
    print("[error] supabase package not installed. Run: pip install supabase")
    sys.exit(1)


# -- Constants --
TABLE_NAME = "phoenix-website_mock_oa"
BUCKET_NAME = "mock_images"
VALID_SECTIONS = [
    "Analog Electronics",
    "Digital Electronics",
    "C / Embedded Systems",
    "Electronics Aptitude",
]

# Regex patterns for parsing (similar to our enhanced JS regexes)
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
        print("[error] Missing Supabase credentials in .env")
        sys.exit(1)
    return create_client(url, key)


def setup_storage(supabase: Client):
    """Ensure the mock_images bucket exists and is public."""
    try:
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets]
        if BUCKET_NAME not in bucket_names:
            print(f"[info] Creating public storage bucket: {BUCKET_NAME}...")
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
    except Exception as e:
        print(f"[warn] Could not verify/create bucket. Make sure '{BUCKET_NAME}' exists and is public. Error: {e}")


def parse_options(text: str):
    """Extract options from question text."""
    for pattern in OPTIONS_REGEXES:
        matches = pattern.findall(text)
        if len(matches) >= 2:
            options = {}
            for i, match in enumerate(matches[:4]):
                options[f"option{i+1}"] = match[1].strip()
            return options
    return None


def clean_question_text(text: str):
    """Remove options from the main question stem."""
    split_pattern = r"(?:\n|\s|^)\([A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\.\s*|(?:\n|\s|^)\[[A-Ea-e1-5]\]\s*"
    parts = re.split(split_pattern, text, maxsplit=1)
    if parts and len(parts[0].strip()) > 5:
        return parts[0].strip()
    return text.strip()


def parse_pdf(pdf_path: str):
    """
    Spatially analyze the PDF.
    Returns a list of dicts: { "text": str, "image_bytes": bytes|None, "image_ext": str|None }
    """
    doc = fitz.open(pdf_path)
    questions = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # 1. Extract Images and their Y-coordinates
        page_images = []
        for img_index, img_info in enumerate(page.get_images(full=True)):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            
            # Find the bounding box of the image on the page
            rects = page.get_image_rects(xref)
            if rects:
                # Use the center Y coordinate
                y_center = (rects[0].y0 + rects[0].y1) / 2
                page_images.append({
                    "bytes": image_bytes,
                    "ext": ext,
                    "y": y_center
                })
        
        # 2. Extract Text Blocks and their Y-coordinates
        blocks = page.get_text("dict")["blocks"]
        text_blocks = []
        for b in blocks:
            if b["type"] == 0:  # text block
                text = ""
                for line in b["lines"]:
                    for span in line["spans"]:
                        text += span["text"] + " "
                text = text.strip()
                if text:
                    y_top = b["bbox"][1]
                    text_blocks.append({"text": text, "y": y_top})
        
        # 3. Group blocks into questions based on Regex and Y-coordinates
        current_q = None
        
        for tb in text_blocks:
            match = QUESTION_START_REGEX.match(tb["text"])
            if match:
                # Start of a new question
                if current_q and len(current_q["text"]) > 10:
                    questions.append(current_q)
                
                # match.group(2) is the rest of the text on that line
                current_q = {
                    "text": match.group(2).strip(),
                    "y_start": tb["y"],
                    "y_end": tb["y"], # will update
                    "image_bytes": None,
                    "image_ext": None
                }
            elif current_q:
                # Continuation of current question
                current_q["text"] += "\n" + tb["text"]
                current_q["y_end"] = tb["y"]
                
        if current_q and len(current_q["text"]) > 10:
            questions.append(current_q)
            
        # 4. Associate images to questions spatially
        # If an image's Y is between a question's Y-start and the next question's Y-start, it belongs to that question.
        for img in page_images:
            best_q = None
            min_dist = float('inf')
            
            # Find the question that starts before this image, but is closest to it
            for q in [q for q in questions if "y_start" in q]: # only consider questions on this page (currently all in `questions` list? wait, we append to a global list)
                # Actually, `questions` contains all questions across pages. We should only check questions added from THIS page.
                pass 
                
            # Let's fix scope: find closest question above the image ON THIS PAGE
            page_qs = [q for q in questions if q.get("page") == page_num]
            
            for q in page_qs:
                if q["y_start"] <= img["y"] + 50: # Allow slight overlap
                    dist = img["y"] - q["y_start"]
                    if dist >= -50 and dist < min_dist:
                        min_dist = dist
                        best_q = q
            
            if best_q and not best_q["image_bytes"]:
                best_q["image_bytes"] = img["bytes"]
                best_q["image_ext"] = img["ext"]
                
        # Annotate page numbers for the logic above
        for q in questions:
            if "page" not in q:
                q["page"] = page_num

    doc.close()
    return questions


def main():
    parser = argparse.ArgumentParser(description="Advanced Spatial PDF Parser & Uploader")
    parser.add_argument("--pdf", required=True, help="Path to the PDF file")
    parser.add_argument("--section", required=True, choices=VALID_SECTIONS, help="Target database section")
    args = parser.parse_args()

    if not os.path.exists(args.pdf):
        print(f"[error] File not found: {args.pdf}")
        sys.exit(1)

    print(f"[*] Parsing PDF spatially: {args.pdf}")
    questions = parse_pdf(args.pdf)
    print(f"[*] Extracted {len(questions)} potential questions.")

    supabase = get_supabase_client()
    setup_storage(supabase)

    uploaded = 0
    errors = 0

    print(f"\n[*] Uploading to section: '{args.section}'")
    for i, q in enumerate(questions):
        text = q["text"].strip()
        if len(text) < 10:
            continue

        opts = parse_options(text)
        clean_txt = clean_question_text(text) if opts else text
        
        # Replace newlines
        clean_txt = clean_txt.replace("\n", " ").strip()
        
        row = {
            "qtext": clean_txt,
            "qimage": None,
            "type": "mcq",
            "section": args.section,
            "option1": opts["option1"] if opts else None,
            "option2": opts["option2"] if opts else None,
            "option3": opts["option3"] if opts else None,
            "option4": opts["option4"] if opts else None,
            "correctans": None,
        }

        # Upload image if found
        if q.get("image_bytes"):
            filename = f"qimg_{uuid.uuid4().hex}.{q['image_ext']}"
            try:
                supabase.storage.from_(BUCKET_NAME).upload(
                    path=filename, 
                    file=q["image_bytes"], 
                    file_options={"content-type": f"image/{q['image_ext']}"}
                )
                # Get public URL
                res = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
                row["qimage"] = res
                print(f"  [{i+1}] Associated image uploaded.")
            except Exception as e:
                print(f"  [{i+1}] ⚠ Failed to upload image: {e}")

        # Insert to DB
        try:
            result = supabase.table(TABLE_NAME).insert(row).execute()
            if result.data:
                print(f"  [{i+1}] ✅ Uploaded: {clean_txt[:60]}...")
                uploaded += 1
            else:
                print(f"  [{i+1}] ❌ DB Insert Failed")
                errors += 1
        except Exception as e:
            print(f"  [{i+1}] ❌ DB Insert Error: {e}")
            errors += 1

    print(f"\n[*] Finished. Uploaded: {uploaded} | Errors: {errors}")


if __name__ == "__main__":
    main()
