from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import uuid
import fitz          # PyMuPDF – C-based, blazing fast
import httpx         # Async HTTP client with connection pooling
import asyncio

app = FastAPI(title="Phoenix Mock OA Parser Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TABLE_NAME = "phoenix-website_mock_oa"
BUCKET_NAME = "mock_images"
BATCH_SIZE = 500  # PostgREST handles large batches fine

# ─── Persistent async HTTP client (reuses TCP connections across requests) ────
_http: httpx.AsyncClient | None = None

async def _client() -> httpx.AsyncClient:
    global _http
    if _http is None or _http.is_closed:
        _http = httpx.AsyncClient(
            timeout=30.0,
            limits=httpx.Limits(max_connections=100, max_keepalive_connections=40),
        )
    return _http

@app.on_event("shutdown")
async def _shutdown():
    global _http
    if _http and not _http.is_closed:
        await _http.aclose()

def _creds():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Missing Supabase credentials.")
    return url, key

# ─── Ensure storage bucket exists (once per process) ─────────────────────────
_bucket_ready = False

async def _ensure_bucket(client: httpx.AsyncClient, url: str, key: str):
    global _bucket_ready
    if _bucket_ready:
        return
    headers = {"Authorization": f"Bearer {key}", "apikey": key}
    try:
        r = await client.get(f"{url}/storage/v1/bucket/{BUCKET_NAME}", headers=headers)
        if r.status_code == 404:
            await client.post(
                f"{url}/storage/v1/bucket",
                headers={**headers, "Content-Type": "application/json"},
                json={"id": BUCKET_NAME, "name": BUCKET_NAME, "public": True},
            )
        _bucket_ready = True
    except Exception as e:
        print(f"[warn] bucket setup: {e}")

# ─── Regex patterns ──────────────────────────────────────────────────────────
# Improved to match various common question starts: 1. 1) 1- 1: Q1. Question 1.
QUESTION_START_RE = re.compile(
    r"^\s*(?:Q(?:uestion)?\s*\.?\s*\d+|\(?\d+\)?)\s*[).:-]\s+(.*)",
    re.IGNORECASE | re.DOTALL,
)

OPTIONS_RES = [
    re.compile(r"(?:^|\s)\(([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s\([A-Ea-e1-5]\))|$)", re.DOTALL),
    re.compile(r"(?:^|\s)([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s[A-Ea-e1-5]\))|$)", re.DOTALL),
    re.compile(r"(?:^|\s)([A-Ea-e1-5])\.\s*(.+?)(?=(?:\s[A-Ea-e1-5]\.)|$)", re.DOTALL),
    re.compile(r"(?:^|\s)\[([A-Ea-e1-5])\]\s*(.+?)(?=(?:\s\[[A-Ea-e1-5]\])|$)", re.DOTALL),
]

def _parse_opts(text: str):
    for pat in OPTIONS_RES:
        m = pat.findall(text)
        if len(m) >= 2:
            return {f"option{i+1}": v[1].strip() for i, v in enumerate(m[:4])}
    return None

def _clean_stem(text: str) -> str:
    sp = r"(?:\n|\s|^)\([A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\.\s*|(?:\n|\s|^)\[[A-Ea-e1-5]\]\s*"
    parts = re.split(sp, text, maxsplit=1)
    return parts[0].strip() if parts and len(parts[0].strip()) > 5 else text.strip()

# ─── PDF parsing (CPU-bound, runs in thread via asyncio.to_thread) ───────────
def _parse_pdf(pdf_bytes: bytes) -> list[dict]:
    """Parse PDF entirely from memory – zero disk I/O."""
    questions: list[dict] = []
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    cur = None

    for pn in range(len(doc)):
        blocks = doc[pn].get_text("dict").get("blocks", [])
        blocks.sort(key=lambda b: (b["bbox"][1], b["bbox"][0]))

        for blk in blocks:
            if blk.get("type", 0) == 0:  # text block
                txt = " ".join(
                    span["text"]
                    for ln in blk.get("lines", [])
                    for span in ln.get("spans", [])
                ).strip()
                if not txt:
                    continue
                m = QUESTION_START_RE.match(txt)
                if m:
                    if cur and len(cur["text"]) > 10:
                        questions.append(cur)
                    cur = {"text": m.group(1).strip(), "img": None, "ext": None}
                elif cur:
                    cur["text"] += "\n" + txt

            elif blk.get("type") == 1 and cur and not cur["img"]:  # image block
                cur["img"] = blk.get("image")
                cur["ext"] = blk.get("ext")

    if cur and len(cur["text"]) > 10:
        questions.append(cur)
    doc.close()
    return questions

# ─── Async image upload (direct Supabase Storage REST) ───────────────────────
async def _upload_img(client: httpx.AsyncClient, url: str, key: str,
                      img_bytes: bytes, ext: str) -> str | None:
    fname = f"qimg_{uuid.uuid4().hex}.{ext}"
    try:
        r = await client.post(
            f"{url}/storage/v1/object/{BUCKET_NAME}/{fname}",
            content=img_bytes,
            headers={
                "Authorization": f"Bearer {key}",
                "apikey": key,
                "Content-Type": f"image/{ext}",
            },
        )
        if r.status_code in (200, 201):
            return f"{url}/storage/v1/object/public/{BUCKET_NAME}/{fname}"
    except Exception as e:
        print(f"img upload err: {e}")
    return None

# ─── Async batch DB insert (direct PostgREST REST) ──────────────────────────
async def _batch_insert(client: httpx.AsyncClient, url: str, key: str, rows: list[dict]):
    """Insert rows in chunks using the PostgREST bulk insert API."""
    if not rows:
        return 0

    headers = {
        "Authorization": f"Bearer {key}",
        "apikey": key,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    inserted = 0
    # Fire all batch chunks concurrently
    async def _do_batch(batch: list[dict]) -> int:
        try:
            r = await client.post(f"{url}/rest/v1/{TABLE_NAME}", json=batch, headers=headers)
            if r.status_code not in (200, 201):
                print(f"[error] batch insert failed ({r.status_code}): {r.text}")
                return 0
            return len(batch)
        except Exception as e:
            print(f"[error] batch insert exception: {e}")
            return 0

    batches = [rows[i : i + BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]
    results = await asyncio.gather(*[_do_batch(b) for b in batches])
    return sum(results)

# ─── Health ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Phoenix PDF Parser"}

# ─── Main endpoint ───────────────────────────────────────────────────────────
@app.post("/parse")
async def parse_and_upload(
    file: UploadFile = File(...),
    domain: str = Form(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Must be a PDF file")

    url, key = _creds()
    client = await _client()
    await _ensure_bucket(client, url, key)

    # Read entire PDF into memory (no temp file)
    pdf_bytes = await file.read()

    # ── Phase 1: Parse PDF (CPU-bound → offload to thread so event loop stays free)
    questions = await asyncio.to_thread(_parse_pdf, pdf_bytes)

    if not questions:
        return {"success": True, "message": "No questions found in PDF.", "count": 0}

    # ── Phase 2: Upload ALL images concurrently via asyncio.gather ────────────
    #    Each upload is a single async HTTP POST – no thread pool overhead.
    img_indices: list[int] = []
    img_coros = []
    for idx, q in enumerate(questions):
        if q["img"]:
            img_indices.append(idx)
            img_coros.append(_upload_img(client, url, key, q["img"], q["ext"]))

    img_urls: dict[int, str | None] = {}
    if img_coros:
        results = await asyncio.gather(*img_coros, return_exceptions=True)
        for i, res in zip(img_indices, results):
            img_urls[i] = res if isinstance(res, str) else None

    # ── Phase 3: Build rows (pure CPU, instant) ──────────────────────────────
    rows: list[dict] = []
    for idx, q in enumerate(questions):
        txt = q["text"].strip()
        if len(txt) < 10:
            continue
        opts = _parse_opts(txt)
        stem = (_clean_stem(txt) if opts else txt).replace("\n", " ").strip()
        rows.append({
            "qtext": stem,
            "qimage": img_urls.get(idx),
            "type": "mcq",
            "section": domain,
            "option1": opts["option1"] if opts else None,
            "option2": opts["option2"] if opts else None,
            "option3": opts["option3"] if opts else None,
            "option4": opts["option4"] if opts else None,
            "correctans": None,
        })

    if not rows:
        return {"success": True, "message": "No valid questions extracted.", "count": 0}

    # ── Phase 4: Batch insert all rows (single async HTTP call) ──────────────
    count = await _batch_insert(client, url, key, rows)

    return {
        "success": True,
        "message": f"Successfully parsed and uploaded {count} questions via Python service.",
        "count": count,
    }
