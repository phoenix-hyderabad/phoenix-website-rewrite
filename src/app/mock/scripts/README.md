# Question Selector GUI

Interactive PDF Question Bank Parser with GUI for selecting and saving questions.

## Features

- **PDF Parsing**: Automatically detects questions in Q1), Q2), etc. format
- **Interactive GUI**: View PDF pages and navigate between questions
- **Custom Region Selection**: Draw rectangles to capture diagrams/images
- **OCR Support**: Extract text from selected regions
- **Local Storage**: Saves questions to organized folder structure

## Requirements

- Python 3.8+
- Tesseract OCR (for OCR features)

### Install Tesseract OCR

**macOS:**

```bash
brew install tesseract
```

**Ubuntu/Debian:**

```bash
sudo apt install tesseract-ocr
```

**Windows:**
Download from https://github.com/UB-Mannheim/tesseract/wiki

## Installation

1. Clone or download this repository

2. Create virtual environment (optional but recommended):

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the application:

```bash
python question_selector_gui.py
```

### Workflow

1. **Open PDF**: File → Open PDF (or the default PDF loads automatically)
2. **Navigate**: Use ◀/▶ buttons or "Go to Q#" to browse questions
3. **Select Regions**: Draw rectangles on diagrams you want to capture
4. **OCR**: Click "OCR Last Region" to extract text from a selection
5. **Save**: Choose a save option:
   - **Text Only**: Just the question text
   - **Text + Detected Images**: Text plus auto-detected images
   - **With Custom Regions**: Text plus your drawn selections
   - **Full Question Region**: Entire question area as image

### Output Structure

Questions are saved to `saved_questions/` directory:

```
saved_questions/
├── index.json
├── Q001_id1/
│   ├── question.json
│   ├── question.txt
│   ├── image_1.png
│   └── region_1.png
└── Q002_id2/
    └── ...
```

## Configuration

Edit these variables in `question_selector_gui.py` to customize:

```python
RENDER_DPI = 150          # PDF rendering quality
IMAGE_DIR = "extracted_images"  # Temp image directory
MIN_QUESTION_LENGTH = 10  # Minimum chars for valid question
```

## License

Internal use only.
