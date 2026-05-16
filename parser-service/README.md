# Phoenix Mock OA PDF Parser Service

A FastAPI-based microservice that extracts multiple-choice questions from PDF files and uploads them to Supabase.

## Features

- **Text Extraction**: Extracts questions and options from PDF documents using pure-Python `pdfplumber` (no C++ compilation)
- **Supabase Integration**: Uploads extracted questions directly to the `phoenix-website_mock_oa` table
- **Concurrent Processing**: Uses ThreadPoolExecutor for fast multi-question processing
- **CORS Enabled**: Works seamlessly with the Phoenix website frontend

## Dependencies

The service uses only **pure-Python dependencies** to avoid C++ compilation issues on cloud platforms like Render:

- `pdfplumber==0.10.3` - Pure Python PDF text/table extraction (replaces PyMuPDF to avoid compilation)
- `fastapi==0.103.1` - Web framework
- `uvicorn==0.23.2` - ASGI server
- `supabase==1.0.4` - Supabase client

No system dependencies (libpoppler, Tesseract, etc.) required!

## Local Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (copy from .env or Render dashboard)
export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="xxxxx"

# Run locally
uvicorn main:app --reload --port 8000
```

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (server-side only) |

## API Endpoints

### POST `/parse`

Uploads and parses a PDF file.

**Request:**
```
POST /parse HTTP/1.1
Content-Type: multipart/form-data

file=<pdf_file>
domain=<domain_name>
```

**Supported domains:**
- `Analog Electronics`
- `Digital Electronics`
- `C / Embedded Systems`
- `Electronics Aptitude`

**Response:**
```json
{
  "success": true,
  "message": "Successfully parsed and uploaded 12 questions via Python service.",
  "count": 12
}
```

### GET `/health`

Health check endpoint.

```json
{
  "status": "ok",
  "service": "Phoenix PDF Parser"
}
```

## Deployment (Render)

No special build configuration needed! Render will automatically:
1. Create a Python environment
2. Install dependencies from `requirements.txt` (pure Python, no compilation)
3. Start the service with `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Expected Environment on Render

- Python 3.10+
- No system library installation required
- Build time: ~2-3 minutes (no C++ compilation)

## Notes

- **Image Extraction**: The service focuses on text extraction. For PDFs with embedded images or diagrams, the Node.js frontend service has a fallback OCR handler (`tesseract.js`) that activates when no MCQs are found.
- **Pure Python**: Replaced `PyMuPDF` (requires C++ build) with `pdfplumber` for cloud-friendly deployment.
- **Concurrent Upload**: Questions are processed and uploaded concurrently (10 workers max) for speed.

## Troubleshooting

### "Failed to parse PDF" Error
- Ensure PDF is text-based (not scanned/image-only)
- Check that questions follow the expected format: `Q1) Question text ... A) ... B) ...`

### "Supabase credentials missing"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set on Render dashboard

### Slow uploads
- Check network bandwidth and concurrent worker count in `process_and_upload` (currently `max_workers=10`)
