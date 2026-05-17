#!/usr/bin/env python3
"""
Question Selector GUI - Interactive PDF Question Bank Parser
============================================================
Features:
1. Parses PDF question banks detecting Q1), Q2), etc. format
2. GUI for each question with options to:
   - Select text only
   - Select text + associated images
   - Draw custom region to capture diagram
   - OCR text from selected regions
3. Database integration for saving selections
4. Improved image detection using page rendering

Requirements:
    pip install pymupdf pillow pytesseract PyQt5
    
    Also install Tesseract OCR:
    - macOS: brew install tesseract
    - Ubuntu: sudo apt install tesseract-ocr
    - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
"""

import fitz  # PyMuPDF
import re
import os
import sys
import json
import shutil
from datetime import datetime
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field
from pathlib import Path

# Load .env from project root
try:
    from dotenv import load_dotenv
    _script_dir = Path(__file__).resolve().parent
    # scripts/ -> mock/ -> app/ -> src/ -> project root
    _project_root = _script_dir.parent.parent.parent.parent.parent
    _env_file = _project_root / ".env"
    load_dotenv(_env_file if _env_file.exists() else None)
except ImportError:
    pass  # env vars must be set manually

# Supabase
try:
    from supabase import create_client as _create_supabase_client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    print("[warn] supabase not available. Install with: pip install supabase")

# GUI libraries - PyQt5
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QFileDialog, QMessageBox, QTextEdit,
    QListWidget, QGroupBox, QScrollArea, QSplitter, QLineEdit,
    QTableWidget, QTableWidgetItem, QHeaderView, QDialog, QSpinBox,
    QStatusBar, QMenuBar, QAction, QToolBar, QComboBox
)
from PyQt5.QtCore import Qt, QRect, QPoint, QSize
from PyQt5.QtGui import QPixmap, QPainter, QPen, QColor, QImage, QFont

from PIL import Image

# OCR
try:
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("[warn] pytesseract not available. Install with: pip install pytesseract")

# -----------------------------
# Configuration
# -----------------------------
QUESTION_REGEX = re.compile(r"^(Q\s*\d+\s*[)\.:])(.+?)(?=^Q\s*\d+\s*[)\.:]|\Z)", 
                            flags=re.IGNORECASE | re.MULTILINE | re.DOTALL)
QUESTION_START_REGEX = re.compile(r"^(Q\s*\d+\s*[)\.:])", flags=re.IGNORECASE | re.MULTILINE)
ANSWER_START_REGEX = re.compile(r"(A\s*\d+\s*[)\.:])", flags=re.IGNORECASE)
CHAPTER_REGEX = re.compile(r"Chapter\s+(\d+)\s*:\s*(.+)", flags=re.IGNORECASE)

MIN_QUESTION_LENGTH = 10
RENDER_DPI = 150  # DPI for rendering PDF pages
IMAGE_DIR = "extracted_images"
DB_FILE = "questions_database.db"
SUPABASE_TABLE = "phoenix-website_mock_oa"
SUPABASE_SECTIONS = [
    "Analog Electronics",
    "Digital Electronics",
    "C / Embedded Systems",
    "Electronics Aptitude",
]


# -----------------------------
# Data Classes
# -----------------------------
@dataclass
class QuestionData:
    """Represents a parsed question with all its data"""
    qid: int
    label: str
    text: str
    page_num: int
    chapter: Optional[str] = None
    bbox: Optional[Tuple[float, float, float, float]] = None
    images: List[str] = field(default_factory=list)
    ocr_text: str = ""
    custom_regions: List[Dict] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        return {
            "qid": self.qid,
            "label": self.label,
            "text": self.text,
            "page_num": self.page_num,
            "chapter": self.chapter,
            "bbox": self.bbox,
            "images": self.images,
            "ocr_text": self.ocr_text,
            "custom_regions": self.custom_regions
        }


# -----------------------------
# Local Storage Manager
# -----------------------------
class LocalStorageManager:
    """Handles saving questions to local directory structure"""
    
    def __init__(self, output_dir: str = "saved_questions"):
        self.output_dir = output_dir
        self.index_file = os.path.join(output_dir, "index.json")
        self.init_storage()
    
    def init_storage(self):
        """Initialize the output directory structure"""
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Create or load index file
        if not os.path.exists(self.index_file):
            self._save_index({"questions": [], "next_id": 1})
        
        print(f"[info] Local storage initialized: {self.output_dir}")
    
    def _load_index(self) -> Dict:
        """Load the index file"""
        try:
            with open(self.index_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {"questions": [], "next_id": 1}
    
    def _save_index(self, index: Dict):
        """Save the index file"""
        with open(self.index_file, "w", encoding="utf-8") as f:
            json.dump(index, f, indent=2, ensure_ascii=False)
    
    def save_question(self, question: QuestionData, pdf_source: str, selection_type: str) -> int:
        """Save a question to local directory and return its ID"""
        index = self._load_index()
        question_id = index["next_id"]
        
        # Create question directory
        q_dir = os.path.join(self.output_dir, f"Q{question.qid:03d}_id{question_id}")
        os.makedirs(q_dir, exist_ok=True)
        
        # Prepare question data
        q_data = {
            "id": question_id,
            "qid": question.qid,
            "label": question.label,
            "text": question.text,
            "page_num": question.page_num,
            "chapter": question.chapter,
            "bbox": question.bbox,
            "ocr_text": question.ocr_text,
            "pdf_source": pdf_source,
            "created_at": datetime.now().isoformat(),
            "selection_type": selection_type,
            "images": [],
            "custom_regions": []
        }
        
        # Copy detected images to question directory
        for i, img_path in enumerate(question.images):
            if os.path.exists(img_path):
                ext = os.path.splitext(img_path)[1]
                new_name = f"image_{i + 1}{ext}"
                new_path = os.path.join(q_dir, new_name)
                shutil.copy2(img_path, new_path)
                q_data["images"].append(new_name)
        
        # Copy custom region images
        for i, region in enumerate(question.custom_regions):
            region_data = {
                "x1": region.get("x1"),
                "y1": region.get("y1"),
                "x2": region.get("x2"),
                "y2": region.get("y2"),
                "ocr_text": region.get("ocr_text", "")
            }
            
            if region.get("image_path") and os.path.exists(region["image_path"]):
                ext = os.path.splitext(region["image_path"])[1]
                new_name = f"region_{i + 1}{ext}"
                new_path = os.path.join(q_dir, new_name)
                shutil.copy2(region["image_path"], new_path)
                region_data["image"] = new_name
            
            q_data["custom_regions"].append(region_data)
        
        # Save question JSON
        q_json_path = os.path.join(q_dir, "question.json")
        with open(q_json_path, "w", encoding="utf-8") as f:
            json.dump(q_data, f, indent=2, ensure_ascii=False)
        
        # Save question text as plain text file
        q_txt_path = os.path.join(q_dir, "question.txt")
        with open(q_txt_path, "w", encoding="utf-8") as f:
            f.write(f"Question {question.qid}\n")
            f.write(f"{'=' * 40}\n\n")
            f.write(question.text)
            if question.ocr_text:
                f.write(f"\n\n--- OCR Text ---\n{question.ocr_text}")
        
        # Update index
        index["questions"].append({
            "id": question_id,
            "qid": question.qid,
            "folder": os.path.basename(q_dir),
            "selection_type": selection_type,
            "created_at": q_data["created_at"],
            "page_num": question.page_num,
            "chapter": question.chapter
        })
        index["next_id"] = question_id + 1
        self._save_index(index)
        
        return question_id
    
    def get_all_questions(self) -> List[Dict]:
        """Retrieve all saved questions from index"""
        index = self._load_index()
        
        questions = []
        for q_info in index["questions"]:
            q_dir = os.path.join(self.output_dir, q_info["folder"])
            q_json = os.path.join(q_dir, "question.json")
            
            if os.path.exists(q_json):
                try:
                    with open(q_json, "r", encoding="utf-8") as f:
                        q_data = json.load(f)
                        questions.append(q_data)
                except:
                    # Use index info as fallback
                    questions.append(q_info)
            else:
                questions.append(q_info)
        
        return sorted(questions, key=lambda x: x.get("created_at", ""), reverse=True)
    
    def delete_question(self, question_id: int):
        """Delete a question and its directory"""
        index = self._load_index()
        
        # Find and remove from index
        for i, q in enumerate(index["questions"]):
            if q["id"] == question_id:
                q_dir = os.path.join(self.output_dir, q["folder"])
                
                # Remove directory
                if os.path.exists(q_dir):
                    shutil.rmtree(q_dir)
                
                # Remove from index
                index["questions"].pop(i)
                self._save_index(index)
                break
    
    def update_question_ocr(self, question_id: int, new_ocr_text: str, qid: int) -> bool:
        """Update only the OCR text for an existing saved question"""
        index = self._load_index()
        
        # Find the question
        for q_info in index["questions"]:
            if q_info["id"] == question_id:
                q_dir = os.path.join(self.output_dir, q_info["folder"])
                q_json_path = os.path.join(q_dir, "question.json")
                q_txt_path = os.path.join(q_dir, "question.txt")
                
                if os.path.exists(q_json_path):
                    # Update JSON file
                    with open(q_json_path, "r", encoding="utf-8") as f:
                        q_data = json.load(f)
                    
                    q_data["ocr_text"] = new_ocr_text
                    q_data["text"] = new_ocr_text  # Also update main text
                    
                    with open(q_json_path, "w", encoding="utf-8") as f:
                        json.dump(q_data, f, indent=2, ensure_ascii=False)
                    
                    # Update text file
                    with open(q_txt_path, "w", encoding="utf-8") as f:
                        f.write(f"Question {qid}\n")
                        f.write(f"{'=' * 40}\n\n")
                        f.write(new_ocr_text)
                    
                    return True
        
        return False
    
    def find_question_by_qid(self, qid: int) -> Optional[Dict]:
        """Find the most recent saved question by its QID (question number)"""
        index = self._load_index()
        
        # Find questions with matching qid, return the most recent one
        matching = []
        for q_info in index["questions"]:
            if q_info["qid"] == qid:
                q_dir = os.path.join(self.output_dir, q_info["folder"])
                q_json = os.path.join(q_dir, "question.json")
                if os.path.exists(q_json):
                    with open(q_json, "r", encoding="utf-8") as f:
                        q_data = json.load(f)
                        matching.append(q_data)
        
        if matching:
            # Return the most recently created one
            return sorted(matching, key=lambda x: x.get("created_at", ""), reverse=True)[0]
        return None


# -----------------------------
# PDF Parser
# -----------------------------
class PDFQuestionParser:
    """Parses PDF and extracts questions with improved image detection"""
    
    def __init__(self, pdf_path: str, image_dir: str = IMAGE_DIR):
        self.pdf_path = pdf_path
        self.image_dir = image_dir
        self.doc = None
        self.questions: List[QuestionData] = []
        self.page_images: Dict[int, bytes] = {}  # Cached rendered pages as PNG bytes
        
        os.makedirs(image_dir, exist_ok=True)
    
    def open(self):
        """Open the PDF document"""
        self.doc = fitz.open(self.pdf_path)
        print(f"[info] Opened PDF: {self.pdf_path} ({len(self.doc)} pages)")
    
    def close(self):
        """Close the PDF document"""
        if self.doc:
            self.doc.close()
    
    def page_count(self) -> int:
        """Get number of pages"""
        return len(self.doc) if self.doc else 0
    
    def render_page_as_pixmap(self, page_num: int, dpi: int = RENDER_DPI) -> fitz.Pixmap:
        """Render a PDF page as a PyMuPDF Pixmap"""
        page = self.doc[page_num]
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        return pix
    
    def render_page_as_qpixmap(self, page_num: int, dpi: int = RENDER_DPI) -> QPixmap:
        """Render a PDF page as a QPixmap for Qt display"""
        pix = self.render_page_as_pixmap(page_num, dpi)
        
        # Convert to QImage then QPixmap
        fmt = QImage.Format_RGB888 if pix.n == 3 else QImage.Format_RGBA8888
        qimg = QImage(pix.samples, pix.width, pix.height, pix.stride, fmt)
        
        return QPixmap.fromImage(qimg)
    
    def get_page_dimensions(self, page_num: int) -> Tuple[float, float]:
        """Get page dimensions in points"""
        page = self.doc[page_num]
        return page.rect.width, page.rect.height
    
    def extract_questions(self) -> List[QuestionData]:
        """Extract all questions from the PDF"""
        self.questions = []
        current_chapter = None
        
        for page_num in range(len(self.doc)):
            page = self.doc[page_num]
            page_text = page.get_text("text")
            
            # Detect chapter
            chap_match = CHAPTER_REGEX.search(page_text)
            if chap_match:
                current_chapter = f"Chapter {chap_match.group(1)}: {chap_match.group(2).strip()}"
            
            # Extract questions from this page
            page_questions = self._extract_questions_from_page(page, page_num, current_chapter)
            
            # Detect and associate images
            page_images = self._extract_images_from_page(page, page_num)
            self._associate_images_to_questions(page_questions, page_images, page)
            
            self.questions.extend(page_questions)
        
        # Sort by page and question ID
        self.questions.sort(key=lambda q: (q.page_num, q.qid or 9999))
        
        print(f"[info] Extracted {len(self.questions)} questions")
        return self.questions
    
    def _extract_questions_from_page(self, page: fitz.Page, page_num: int, chapter: str) -> List[QuestionData]:
        """Extract questions from a single page with bounding boxes"""
        questions = []
        
        # Get text blocks with positions
        blocks = page.get_text("dict")["blocks"]
        text_blocks = [b for b in blocks if b.get("type") == 0]
        
        # Build full page text for question detection
        full_text = page.get_text("text")
        
        # Find question matches
        matches = list(QUESTION_START_REGEX.finditer(full_text))
        
        for i, match in enumerate(matches):
            # Get question number
            qnum_match = re.search(r"Q\s*(\d+)", match.group(1), flags=re.IGNORECASE)
            qnum = int(qnum_match.group(1)) if qnum_match else i + 1
            
            # Get question text range
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(full_text)
            
            question_text = full_text[start:end].strip()
            # Remove label
            question_text = re.sub(r"^Q\s*\d+\s*[)\.:]\s*", "", question_text, flags=re.IGNORECASE).strip()
            
            # Check for answer marker
            ans_match = ANSWER_START_REGEX.search(question_text)
            if ans_match:
                question_text = question_text[:ans_match.start()].strip()
            
            if len(question_text) < MIN_QUESTION_LENGTH:
                continue
            
            # Try to find bounding box for this question
            bbox = self._find_question_bbox(text_blocks, match.group(1), question_text)
            
            questions.append(QuestionData(
                qid=qnum,
                label=match.group(1).strip(),
                text=self._normalize_whitespace(question_text),
                page_num=page_num,
                chapter=chapter,
                bbox=bbox
            ))
        
        return questions
    
    def _find_question_bbox(self, text_blocks: List[Dict], label: str, text: str) -> Optional[Tuple[float, float, float, float]]:
        """Find bounding box for a question based on its text"""
        label_clean = re.sub(r"\s+", "", label.lower())
        text_start = text[:50].lower() if len(text) > 50 else text.lower()
        
        for block in text_blocks:
            block_text = ""
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    block_text += span.get("text", "")
            
            block_text_clean = re.sub(r"\s+", "", block_text.lower())
            
            if label_clean in block_text_clean or text_start[:20] in block_text.lower():
                return tuple(block.get("bbox", (0, 0, 0, 0)))
        
        return None
    
    def _extract_images_from_page(self, page: fitz.Page, page_num: int) -> List[Dict]:
        """Extract all images from a page with improved detection"""
        images = []
        
        # Method 1: Extract embedded images
        img_list = page.get_images()
        for img_index, img_info in enumerate(img_list):
            try:
                xref = img_info[0]
                base_image = self.doc.extract_image(xref)
                if not base_image:
                    continue
                
                image_bytes = base_image["image"]
                ext = base_image.get("ext", "png")
                
                fname = f"page_{page_num + 1}_img_{xref}.{ext}"
                fpath = os.path.join(self.image_dir, fname)
                
                with open(fpath, "wb") as f:
                    f.write(image_bytes)
                
                # Try to find bbox
                bbox = self._find_image_bbox_on_page(page, xref, img_index)
                
                images.append({
                    "path": fpath,
                    "bbox": bbox,
                    "xref": xref,
                    "type": "embedded"
                })
                
            except Exception as e:
                print(f"[warn] Could not extract image on page {page_num + 1}: {e}")
        
        # Method 2: Detect vector graphics regions
        try:
            drawings = page.get_drawings()
            if drawings and len(drawings) > 5:  # Threshold for significant drawings
                # Group nearby drawings into regions
                regions = self._cluster_drawings(drawings, page.rect)
                
                for idx, region in enumerate(regions):
                    # Render the region
                    clip = fitz.Rect(region)
                    mat = fitz.Matrix(3, 3)  # High quality
                    pix = page.get_pixmap(clip=clip, matrix=mat)
                    
                    fname = f"page_{page_num + 1}_vector_{idx}.png"
                    fpath = os.path.join(self.image_dir, fname)
                    pix.save(fpath)
                    
                    images.append({
                        "path": fpath,
                        "bbox": region,
                        "type": "vector"
                    })
                    
        except Exception as e:
            print(f"[warn] Vector detection failed on page {page_num + 1}: {e}")
        
        return images
    
    def _find_image_bbox_on_page(self, page: fitz.Page, xref: int, img_index: int) -> Tuple[float, float, float, float]:
        """Find bounding box of an image on the page"""
        # Try to get from image placements
        try:
            blocks = page.get_text("dict")["blocks"]
            image_blocks = [b for b in blocks if b.get("type") == 1]
            
            if img_index < len(image_blocks):
                return tuple(image_blocks[img_index].get("bbox", (0, 0, 100, 100)))
        except:
            pass
        
        # Fallback: use page center
        w, h = page.rect.width, page.rect.height
        return (w * 0.1, h * 0.3, w * 0.9, h * 0.7)
    
    def _cluster_drawings(self, drawings: List[Dict], page_rect: fitz.Rect) -> List[Tuple[float, float, float, float]]:
        """Cluster nearby drawings into regions"""
        if not drawings:
            return []
        
        # Get all drawing rectangles
        rects = []
        for d in drawings:
            if d.get("rect"):
                rects.append(fitz.Rect(d["rect"]))
        
        if not rects:
            return []
        
        # Simple clustering: merge overlapping or nearby rectangles
        clusters = []
        used = set()
        
        PROXIMITY = 20  # pixels
        
        for i, r1 in enumerate(rects):
            if i in used:
                continue
            
            cluster = fitz.Rect(r1)
            used.add(i)
            
            # Find all rectangles close to this one
            changed = True
            while changed:
                changed = False
                for j, r2 in enumerate(rects):
                    if j in used:
                        continue
                    
                    # Check if r2 is close to current cluster
                    expanded = fitz.Rect(
                        cluster.x0 - PROXIMITY,
                        cluster.y0 - PROXIMITY,
                        cluster.x1 + PROXIMITY,
                        cluster.y1 + PROXIMITY
                    )
                    
                    if expanded.intersects(r2):
                        cluster = cluster | r2  # Union
                        used.add(j)
                        changed = True
            
            # Only keep significant clusters
            if cluster.width > 50 and cluster.height > 50:
                # Add padding
                padded = (
                    max(0, cluster.x0 - 10),
                    max(0, cluster.y0 - 10),
                    min(page_rect.width, cluster.x1 + 10),
                    min(page_rect.height, cluster.y1 + 10)
                )
                clusters.append(padded)
        
        return clusters
    
    def _associate_images_to_questions(self, questions: List[QuestionData], images: List[Dict], page: fitz.Page):
        """Associate images to questions based on spatial proximity"""
        if not questions or not images:
            return
        
        page_height = page.rect.height
        
        for img in images:
            img_bbox = img["bbox"]
            img_center_y = (img_bbox[1] + img_bbox[3]) / 2
            
            best_question = None
            best_distance = float('inf')
            
            for q in questions:
                if not q.bbox:
                    continue
                
                q_bottom = q.bbox[3]
                
                # Image should be below or overlapping with question
                if img_bbox[1] >= q.bbox[1] - 50:  # Allow some overlap
                    # Calculate distance
                    if img_bbox[1] >= q_bottom:
                        # Image is below question
                        distance = img_bbox[1] - q_bottom
                    else:
                        # Image overlaps with question
                        distance = 0
                    
                    if distance < best_distance:
                        best_distance = distance
                        best_question = q
            
            # Associate if within reasonable distance
            if best_question and best_distance < page_height * 0.3:
                best_question.images.append(img["path"])
    
    def _normalize_whitespace(self, text: str) -> str:
        """Normalize whitespace in text"""
        return re.sub(r"\s+", " ", text).strip()
    
    def save_region_as_image(self, page_num: int, bbox: Tuple[float, float, float, float], 
                             filename: str, dpi: int = 200) -> str:
        """Save a specific region of a page as an image"""
        page = self.doc[page_num]
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        
        clip = fitz.Rect(bbox)
        pix = page.get_pixmap(clip=clip, matrix=mat)
        
        fpath = os.path.join(self.image_dir, filename)
        pix.save(fpath)
        
        return fpath


# -----------------------------
# Canvas Widget for Selection
# -----------------------------
class SelectableImageLabel(QLabel):
    """A QLabel that supports mouse selection of rectangular regions"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMouseTracking(True)
        self.setCursor(Qt.CrossCursor)
        
        self.original_pixmap = None
        self.scale_factor = 1.0
        
        self.selection_start = None
        self.selection_end = None
        self.is_selecting = False
        
        self.regions = []  # List of (x1, y1, x2, y2) tuples
        self.question_bbox = None  # Current question highlight
    
    def set_pixmap_scaled(self, pixmap: QPixmap, max_width: int = 800, max_height: int = 900):
        """Set pixmap with scaling to fit within max dimensions"""
        self.original_pixmap = pixmap
        
        # Calculate scale factor
        scale_x = max_width / pixmap.width() if pixmap.width() > max_width else 1.0
        scale_y = max_height / pixmap.height() if pixmap.height() > max_height else 1.0
        self.scale_factor = min(scale_x, scale_y, 1.0)
        
        scaled = pixmap.scaled(
            int(pixmap.width() * self.scale_factor),
            int(pixmap.height() * self.scale_factor),
            Qt.KeepAspectRatio,
            Qt.SmoothTransformation
        )
        
        self.setPixmap(scaled)
        self.setFixedSize(scaled.size())
        
        # Clear regions when image changes
        self.regions = []
        self.question_bbox = None
        self.update()
    
    def set_question_highlight(self, bbox: Tuple[float, float, float, float], dpi: int = RENDER_DPI):
        """Set the question bounding box to highlight"""
        if bbox:
            zoom = dpi / 72.0 * self.scale_factor
            self.question_bbox = (
                bbox[0] * zoom,
                bbox[1] * zoom,
                bbox[2] * zoom,
                bbox[3] * zoom
            )
        else:
            self.question_bbox = None
        self.update()
    
    def clear_regions(self):
        """Clear all selection regions"""
        self.regions = []
        self.update()
    
    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.selection_start = event.pos()
            self.selection_end = event.pos()
            self.is_selecting = True
    
    def mouseMoveEvent(self, event):
        if self.is_selecting:
            self.selection_end = event.pos()
            self.update()
    
    def mouseReleaseEvent(self, event):
        if event.button() == Qt.LeftButton and self.is_selecting:
            self.is_selecting = False
            
            # Normalize coordinates
            x1 = min(self.selection_start.x(), self.selection_end.x())
            y1 = min(self.selection_start.y(), self.selection_end.y())
            x2 = max(self.selection_start.x(), self.selection_end.x())
            y2 = max(self.selection_start.y(), self.selection_end.y())
            
            # Only add if region is significant
            if abs(x2 - x1) > 10 and abs(y2 - y1) > 10:
                self.regions.append((x1, y1, x2, y2))
            
            self.selection_start = None
            self.selection_end = None
            self.update()
    
    def paintEvent(self, event):
        super().paintEvent(event)
        
        if not self.pixmap():
            return
        
        painter = QPainter(self)
        
        # Draw question highlight (blue)
        if self.question_bbox:
            pen = QPen(QColor(0, 0, 255, 180))
            pen.setWidth(3)
            painter.setPen(pen)
            x1, y1, x2, y2 = self.question_bbox
            painter.drawRect(int(x1), int(y1), int(x2 - x1), int(y2 - y1))
        
        # Draw saved regions (green)
        pen = QPen(QColor(0, 200, 0, 200))
        pen.setWidth(2)
        painter.setPen(pen)
        for region in self.regions:
            x1, y1, x2, y2 = region
            painter.drawRect(int(x1), int(y1), int(x2 - x1), int(y2 - y1))
        
        # Draw current selection (red dashed)
        if self.is_selecting and self.selection_start and self.selection_end:
            pen = QPen(QColor(255, 0, 0, 200))
            pen.setWidth(2)
            pen.setStyle(Qt.DashLine)
            painter.setPen(pen)
            
            x1 = min(self.selection_start.x(), self.selection_end.x())
            y1 = min(self.selection_start.y(), self.selection_end.y())
            x2 = max(self.selection_start.x(), self.selection_end.x())
            y2 = max(self.selection_start.y(), self.selection_end.y())
            
            painter.drawRect(x1, y1, x2 - x1, y2 - y1)
        
        painter.end()
    
    def get_regions_pdf_coords(self, dpi: int = RENDER_DPI) -> List[Tuple[float, float, float, float]]:
        """Convert canvas regions to PDF coordinates"""
        pdf_regions = []
        zoom = dpi / 72.0 * self.scale_factor
        
        for region in self.regions:
            x1, y1, x2, y2 = region
            pdf_regions.append((
                x1 / zoom,
                y1 / zoom,
                x2 / zoom,
                y2 / zoom
            ))
        
        return pdf_regions


# -----------------------------
# Main Window
# -----------------------------
class QuestionSelectorGUI(QMainWindow):
    """Main GUI application for selecting and saving questions"""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Question Selector - PDF Question Bank Parser")
        self.setGeometry(100, 100, 1400, 900)
        
        self.parser: Optional[PDFQuestionParser] = None
        self.storage = LocalStorageManager()
        self.current_question_index = 0
        self.questions: List[QuestionData] = []
        self.pdf_path = ""
        
        self._setup_ui()
        self._setup_menu()
        
        self.statusBar().showMessage("Ready. Open a PDF to begin.")
        
        # Auto-load default PDF
        default_pdf = "/Users/ronil/Documents/VSCode/Python Projects/Phoenix Question Parser/Digital Question Bank LB.pdf"
        if os.path.exists(default_pdf):
            self.pdf_path = default_pdf
            self._load_pdf(default_pdf)
    
    def _setup_menu(self):
        """Setup the menu bar"""
        menubar = self.menuBar()
        
        # File menu
        file_menu = menubar.addMenu("File")
        
        open_action = QAction("Open PDF", self)
        open_action.setShortcut("Ctrl+O")
        open_action.triggered.connect(self._open_pdf)
        file_menu.addAction(open_action)
        
        file_menu.addSeparator()
        
        view_db_action = QAction("View Saved Questions", self)
        view_db_action.triggered.connect(self._view_saved_questions)
        file_menu.addAction(view_db_action)
        
        file_menu.addSeparator()
        
        exit_action = QAction("Exit", self)
        exit_action.setShortcut("Ctrl+Q")
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)
        
        # Help menu
        help_menu = menubar.addMenu("Help")
        
        about_action = QAction("About", self)
        about_action.triggered.connect(self._show_about)
        help_menu.addAction(about_action)
    
    def _setup_ui(self):
        """Setup the main UI components"""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QHBoxLayout(central_widget)
        
        # Left panel - PDF view
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        
        pdf_group = QGroupBox("PDF View (Draw rectangles to select regions)")
        pdf_layout = QVBoxLayout(pdf_group)
        
        # Scrollable image view
        scroll_area = QScrollArea()
        scroll_area.setWidgetResizable(True)
        scroll_area.setMinimumWidth(800)
        
        self.image_label = SelectableImageLabel()
        self.image_label.setAlignment(Qt.AlignTop | Qt.AlignLeft)
        scroll_area.setWidget(self.image_label)
        
        pdf_layout.addWidget(scroll_area)
        left_layout.addWidget(pdf_group)
        
        # Right panel - Controls
        right_widget = QWidget()
        right_widget.setFixedWidth(400)
        right_layout = QVBoxLayout(right_widget)
        
        # Navigation
        nav_group = QGroupBox("Navigation")
        nav_layout = QVBoxLayout(nav_group)
        
        nav_buttons = QHBoxLayout()
        self.prev_btn = QPushButton("◀ Previous")
        self.prev_btn.clicked.connect(self._prev_question)
        self.question_label = QLabel("No PDF loaded")
        self.question_label.setAlignment(Qt.AlignCenter)
        self.next_btn = QPushButton("Next ▶")
        self.next_btn.clicked.connect(self._next_question)
        
        nav_buttons.addWidget(self.prev_btn)
        nav_buttons.addWidget(self.question_label, 1)
        nav_buttons.addWidget(self.next_btn)
        nav_layout.addLayout(nav_buttons)
        
        # Jump to question
        jump_layout = QHBoxLayout()
        jump_layout.addWidget(QLabel("Go to Q#:"))
        self.jump_spinbox = QSpinBox()
        self.jump_spinbox.setMinimum(1)
        self.jump_spinbox.setMaximum(9999)
        jump_layout.addWidget(self.jump_spinbox)
        jump_btn = QPushButton("Go")
        jump_btn.clicked.connect(self._jump_to_question)
        jump_layout.addWidget(jump_btn)
        jump_layout.addStretch()
        nav_layout.addLayout(jump_layout)
        
        right_layout.addWidget(nav_group)
        
        # Question info
        info_group = QGroupBox("Question Info")
        info_layout = QVBoxLayout(info_group)
        self.info_text = QTextEdit()
        self.info_text.setReadOnly(True)
        self.info_text.setMaximumHeight(150)
        info_layout.addWidget(self.info_text)
        right_layout.addWidget(info_group)
        
        # Detected images
        images_group = QGroupBox("Detected Images")
        images_layout = QVBoxLayout(images_group)
        self.images_list = QListWidget()
        self.images_list.setMaximumHeight(80)
        images_layout.addWidget(self.images_list)
        right_layout.addWidget(images_group)
        
        # Custom regions
        regions_group = QGroupBox("Custom Regions (Draw on canvas)")
        regions_layout = QVBoxLayout(regions_group)
        self.regions_list = QListWidget()
        self.regions_list.setMaximumHeight(80)
        regions_layout.addWidget(self.regions_list)
        
        regions_buttons = QHBoxLayout()
        ocr_btn = QPushButton("OCR Last Region")
        ocr_btn.clicked.connect(self._ocr_last_region)
        regions_buttons.addWidget(ocr_btn)
        clear_btn = QPushButton("Clear Regions")
        clear_btn.clicked.connect(self._clear_regions)
        regions_buttons.addWidget(clear_btn)
        regions_layout.addLayout(regions_buttons)
        
        right_layout.addWidget(regions_group)
        
        # OCR result
        ocr_group = QGroupBox("OCR Result")
        ocr_layout = QVBoxLayout(ocr_group)
        self.ocr_text = QTextEdit()
        self.ocr_text.setMaximumHeight(100)
        ocr_layout.addWidget(self.ocr_text)
        right_layout.addWidget(ocr_group)
        
        # Save buttons
        save_group = QGroupBox("Save Question")
        save_layout = QVBoxLayout(save_group)
        
        btn_text_only = QPushButton("💾 Save Text Only")
        btn_text_only.clicked.connect(lambda: self._save_question("text_only"))
        save_layout.addWidget(btn_text_only)
        
        btn_text_images = QPushButton("💾 Save Text + Detected Images")
        btn_text_images.clicked.connect(lambda: self._save_question("text_and_images"))
        save_layout.addWidget(btn_text_images)
        
        btn_with_regions = QPushButton("💾 Save with Custom Regions")
        btn_with_regions.clicked.connect(lambda: self._save_question("with_custom_regions"))
        save_layout.addWidget(btn_with_regions)
        
        btn_full_page = QPushButton("💾 Save Full Question Region")
        btn_full_page.clicked.connect(lambda: self._save_question("full_page"))
        save_layout.addWidget(btn_full_page)
        
        btn_update_ocr = QPushButton("✏️ Update OCR Text Only")
        btn_update_ocr.setToolTip("Update OCR text for an existing saved question\n(Draw region, run OCR, then click this)")
        btn_update_ocr.clicked.connect(self._update_ocr_text_only)
        save_layout.addWidget(btn_update_ocr)
        
        right_layout.addWidget(save_group)

        # ── Supabase Upload ────────────────────────────────────────
        upload_group = QGroupBox("Upload to Supabase")
        upload_layout = QVBoxLayout(upload_group)

        upload_layout.addWidget(QLabel("Section:"))
        self.section_combo = QComboBox()
        self.section_combo.addItems(SUPABASE_SECTIONS)
        upload_layout.addWidget(self.section_combo)

        btn_upload_one = QPushButton("☁️ Upload This Question")
        btn_upload_one.setToolTip("Save & immediately upload current question to Supabase")
        btn_upload_one.clicked.connect(self._upload_current_to_supabase)
        upload_layout.addWidget(btn_upload_one)

        btn_upload_all = QPushButton("☁️ Upload ALL Saved Questions")
        btn_upload_all.setToolTip("Upload all questions in saved_questions/ to Supabase")
        btn_upload_all.clicked.connect(self._upload_all_to_supabase)
        upload_layout.addWidget(btn_upload_all)

        if not SUPABASE_AVAILABLE:
            lbl_warn = QLabel("⚠ supabase not installed")
            lbl_warn.setStyleSheet("color: orange; font-size: 10px;")
            upload_layout.addWidget(lbl_warn)

        right_layout.addWidget(upload_group)
        
        right_layout.addStretch()
        
        # Add to main layout
        splitter = QSplitter(Qt.Horizontal)
        splitter.addWidget(left_widget)
        splitter.addWidget(right_widget)
        splitter.setSizes([1000, 400])
        
        main_layout.addWidget(splitter)
    
    def _open_pdf(self):
        """Open a PDF file"""
        filepath, _ = QFileDialog.getOpenFileName(
            self,
            "Select PDF Question Bank",
            "",
            "PDF files (*.pdf);;All files (*.*)"
        )
        
        if not filepath:
            return
        
        self.pdf_path = filepath
        self._load_pdf(filepath)
    
    def _load_pdf(self, filepath: str):
        """Load a PDF file"""
        self.statusBar().showMessage(f"Loading: {os.path.basename(filepath)}...")
        QApplication.processEvents()
        
        try:
            # Close previous parser if any
            if self.parser:
                self.parser.close()
            
            # Create new parser
            self.parser = PDFQuestionParser(filepath)
            self.parser.open()
            
            # Extract questions
            self.questions = self.parser.extract_questions()
            self.current_question_index = 0
            
            if self.questions:
                self.jump_spinbox.setMaximum(max(q.qid for q in self.questions if q.qid))
                self._display_current_question()
                self.statusBar().showMessage(f"Loaded {len(self.questions)} questions from {os.path.basename(filepath)}")
            else:
                self.statusBar().showMessage("No questions found in PDF")
                QMessageBox.warning(
                    self, "Warning",
                    "No questions detected in the PDF.\nThe PDF may not follow the expected Q1), Q2) format."
                )
        
        except Exception as e:
            self.statusBar().showMessage(f"Error: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to load PDF:\n{str(e)}")
    
    def _display_current_question(self):
        """Display the current question"""
        if not self.questions or self.current_question_index >= len(self.questions):
            return
        
        question = self.questions[self.current_question_index]
        
        # Update navigation label
        self.question_label.setText(f"Q{question.qid} ({self.current_question_index + 1}/{len(self.questions)})")
        
        # Update info text
        info = f"<b>Question {question.qid}</b><br>"
        info += f"Page: {question.page_num + 1}<br>"
        if question.chapter:
            info += f"Chapter: {question.chapter}<br>"
        info += f"<br>{question.text}"
        self.info_text.setHtml(info)
        
        # Update images list
        self.images_list.clear()
        for img_path in question.images:
            self.images_list.addItem(os.path.basename(img_path))
        
        # Clear regions
        self._clear_regions()
        
        # Render page
        try:
            pixmap = self.parser.render_page_as_qpixmap(question.page_num)
            self.image_label.set_pixmap_scaled(pixmap)
            
            # Highlight question bbox
            if question.bbox:
                self.image_label.set_question_highlight(question.bbox)
            
        except Exception as e:
            self.statusBar().showMessage(f"Display error: {str(e)}")
    
    def _prev_question(self):
        """Go to previous question"""
        if self.current_question_index > 0:
            self.current_question_index -= 1
            self._display_current_question()
    
    def _next_question(self):
        """Go to next question"""
        if self.current_question_index < len(self.questions) - 1:
            self.current_question_index += 1
            self._display_current_question()
    
    def _jump_to_question(self):
        """Jump to a specific question number"""
        qnum = self.jump_spinbox.value()
        for i, q in enumerate(self.questions):
            if q.qid == qnum:
                self.current_question_index = i
                self._display_current_question()
                return
        QMessageBox.information(self, "Info", f"Question {qnum} not found")
    
    def _update_regions_list(self):
        """Update the regions list widget"""
        self.regions_list.clear()
        pdf_regions = self.image_label.get_regions_pdf_coords()
        for i, region in enumerate(pdf_regions):
            self.regions_list.addItem(
                f"Region {i + 1}: ({int(region[0])},{int(region[1])}) to ({int(region[2])},{int(region[3])})"
            )
    
    def _ocr_last_region(self):
        """Perform OCR on the last selected region"""
        if not self.parser or not OCR_AVAILABLE:
            if not OCR_AVAILABLE:
                QMessageBox.warning(self, "Warning", "OCR not available. Install pytesseract.")
            return
        
        pdf_regions = self.image_label.get_regions_pdf_coords()
        if not pdf_regions:
            QMessageBox.information(self, "Info", "No region selected. Draw a rectangle on the image first.")
            return
        
        question = self.questions[self.current_question_index]
        region = pdf_regions[-1]
        
        try:
            # Extract region image
            page = self.parser.doc[question.page_num]
            zoom = 2.0  # Higher quality for OCR
            mat = fitz.Matrix(zoom, zoom)
            clip = fitz.Rect(region)
            pix = page.get_pixmap(clip=clip, matrix=mat)
            
            # Convert to PIL Image
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # Perform OCR
            text = pytesseract.image_to_string(img, config='--psm 6')
            
            # Display result
            self.ocr_text.setText(text.strip())
            self.statusBar().showMessage("OCR completed successfully")
            
            # Update regions list
            self._update_regions_list()
            
        except Exception as e:
            self.statusBar().showMessage(f"OCR error: {str(e)}")
            QMessageBox.critical(self, "OCR Error", str(e))
    
    def _clear_regions(self):
        """Clear all custom regions"""
        self.image_label.clear_regions()
        self.regions_list.clear()
        self.ocr_text.clear()
    
    def _save_question(self, selection_type: str):
        """Save the current question to database"""
        if not self.questions:
            QMessageBox.warning(self, "Warning", "No questions loaded")
            return
        
        question = self.questions[self.current_question_index]
        
        # Get custom regions from canvas
        pdf_regions = self.image_label.get_regions_pdf_coords()
        question.custom_regions = []
        
        if selection_type in ["with_custom_regions", "full_page"] and pdf_regions:
            for i, region in enumerate(pdf_regions):
                # Save region as image
                filename = f"q{question.qid}_page{question.page_num + 1}_region{i + 1}.png"
                
                try:
                    img_path = self.parser.save_region_as_image(question.page_num, region, filename)
                    
                    # Perform OCR on the region
                    ocr_text = ""
                    if OCR_AVAILABLE:
                        try:
                            page = self.parser.doc[question.page_num]
                            zoom = 2.0
                            mat = fitz.Matrix(zoom, zoom)
                            clip = fitz.Rect(region)
                            pix = page.get_pixmap(clip=clip, matrix=mat)
                            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                            ocr_text = pytesseract.image_to_string(img, config='--psm 6').strip()
                        except:
                            pass
                    
                    question.custom_regions.append({
                        "x1": region[0], "y1": region[1],
                        "x2": region[2], "y2": region[3],
                        "image_path": img_path,
                        "ocr_text": ocr_text
                    })
                except Exception as e:
                    print(f"[warn] Could not save region image: {e}")
        
        if selection_type == "full_page" and question.bbox:
            # Save full question region
            filename = f"q{question.qid}_page{question.page_num + 1}_full.png"
            try:
                page = self.parser.doc[question.page_num]
                # Expand bbox to include potential diagrams below
                expanded_bbox = (
                    max(0, question.bbox[0] - 20),
                    max(0, question.bbox[1] - 20),
                    min(page.rect.width, question.bbox[2] + 20),
                    min(page.rect.height, question.bbox[3] + 200)
                )
                img_path = self.parser.save_region_as_image(question.page_num, expanded_bbox, filename)
                if img_path not in question.images:
                    question.images.append(img_path)
            except Exception as e:
                print(f"[warn] Could not save full region: {e}")
        
        try:
            question_id = self.storage.save_question(question, self.pdf_path, selection_type)
            save_dir = os.path.join(self.storage.output_dir, f"Q{question.qid:03d}_id{question_id}")
            self.statusBar().showMessage(f"✓ Saved Q{question.qid} to {save_dir}")
            QMessageBox.information(
                self, "Success",
                f"Question {question.qid} saved successfully!\nFolder: {save_dir}"
            )
        except Exception as e:
            self.statusBar().showMessage(f"Save error: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to save question:\n{str(e)}")
    
    def _update_ocr_text_only(self):
        """Update only the OCR text for an existing saved question"""
        if not self.questions:
            QMessageBox.warning(self, "Warning", "No questions loaded")
            return
        
        question = self.questions[self.current_question_index]
        ocr_text = self.ocr_text.toPlainText().strip()
        
        if not ocr_text:
            QMessageBox.warning(
                self, "Warning",
                "No OCR text available.\n\nTo use this feature:\n"
                "1. Draw a custom region on the image\n"
                "2. Click 'OCR Last Region' to extract text\n"
                "3. Then click this button to save the OCR text"
            )
            return
        
        # Find existing saved question with this QID
        existing = self.storage.find_question_by_qid(question.qid)
        
        if not existing:
            QMessageBox.warning(
                self, "Warning",
                f"Question {question.qid} has not been saved yet.\n"
                "Please save the question first using one of the other save options."
            )
            return
        
        # Update the OCR text
        success = self.storage.update_question_ocr(existing["id"], ocr_text, question.qid)
        
        if success:
            save_dir = os.path.join(self.storage.output_dir, f"Q{question.qid:03d}_id{existing['id']}")
            self.statusBar().showMessage(f"✓ Updated OCR text for Q{question.qid}")
            QMessageBox.information(
                self, "Success",
                f"OCR text updated for Question {question.qid}!\nFolder: {save_dir}"
            )
        else:
            QMessageBox.critical(
                self, "Error",
                f"Failed to update OCR text for Question {question.qid}"
            )
    
    def _view_saved_questions(self):
        """Open dialog to view saved questions"""
        dialog = QDialog(self)
        dialog.setWindowTitle("Saved Questions")
        dialog.setGeometry(200, 200, 900, 600)
        
        layout = QVBoxLayout(dialog)
        
        # Table
        table = QTableWidget()
        table.setColumnCount(6)
        table.setHorizontalHeaderLabels(["ID", "QID", "Page", "Chapter", "Type", "Created"])
        table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        
        # Load data
        questions = self.storage.get_all_questions()
        table.setRowCount(len(questions))
        
        for row, q in enumerate(questions):
            table.setItem(row, 0, QTableWidgetItem(str(q["id"])))
            table.setItem(row, 1, QTableWidgetItem(str(q["qid"])))
            table.setItem(row, 2, QTableWidgetItem(str(q["page_num"])))
            table.setItem(row, 3, QTableWidgetItem(q["chapter"] or ""))
            table.setItem(row, 4, QTableWidgetItem(q["selection_type"]))
            table.setItem(row, 5, QTableWidgetItem(q["created_at"][:19] if q["created_at"] else ""))
        
        layout.addWidget(table)
        
        # Preview
        preview_group = QGroupBox("Question Text Preview")
        preview_layout = QVBoxLayout(preview_group)
        preview_text = QTextEdit()
        preview_text.setReadOnly(True)
        preview_text.setMaximumHeight(120)
        preview_layout.addWidget(preview_text)
        layout.addWidget(preview_group)
        
        # Selection handler
        def on_selection_changed():
            selected = table.selectedItems()
            if selected:
                row = selected[0].row()
                q_id = int(table.item(row, 0).text())
                for q in questions:
                    if q["id"] == q_id:
                        preview_text.setText(q["text"] or "(No text)")
                        break
        
        table.itemSelectionChanged.connect(on_selection_changed)
        
        # Delete button
        def delete_selected():
            selected = table.selectedItems()
            if selected:
                row = selected[0].row()
                q_id = int(table.item(row, 0).text())
                
                reply = QMessageBox.question(
                    dialog, "Confirm",
                    "Delete selected question?",
                    QMessageBox.Yes | QMessageBox.No
                )
                
                if reply == QMessageBox.Yes:
                    self.storage.delete_question(q_id)
                    table.removeRow(row)
        
        delete_btn = QPushButton("Delete Selected")
        delete_btn.clicked.connect(delete_selected)
        layout.addWidget(delete_btn)
        
        dialog.exec_()
    
    def _show_about(self):
        """Show about dialog"""
        QMessageBox.about(
            self, "About Question Selector",
            "<h3>Question Selector GUI</h3>"
            "<p>Interactive PDF Question Bank Parser</p>"
            "<p>Features:</p>"
            "<ul>"
            "<li>Parse PDF question banks (Q1, Q2, etc.)</li>"
            "<li>Draw custom regions for diagrams</li>"
            "<li>OCR text extraction</li>"
            "<li>SQLite database storage</li>"
            "</ul>"
            f"<p>OCR Available: {'Yes' if OCR_AVAILABLE else 'No'}</p>"
        )
    
    def closeEvent(self, event):
        """Handle window close"""
        if self.parser:
            self.parser.close()
        event.accept()

    # ── Supabase helpers ────────────────────────────────────────────────────

    def _get_supabase_client(self):
        """Create and return a Supabase client, or None on error."""
        if not SUPABASE_AVAILABLE:
            QMessageBox.warning(self, "Supabase", "supabase package not installed.\n\nRun: pip install supabase")
            return None

        url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        key = (
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        )

        if not url or not key:
            QMessageBox.warning(
                self, "Supabase",
                "Supabase credentials not found.\n\n"
                "Make sure your .env contains:\n"
                "  NEXT_PUBLIC_SUPABASE_URL\n"
                "  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
            )
            return None

        return _create_supabase_client(url, key)

    def _build_supabase_row(self, q_data: dict, section: str) -> dict:
        """Build a Supabase row dict from saved question data."""
        import re as _re
        text = (q_data.get("text") or q_data.get("ocr_text") or "").strip()

        # Try to parse MCQ options embedded in the text
        option_pattern = _re.compile(
            r'(?:^|\n)\s*(?:\(?([A-Da-d])[).]\s*)(.+?)(?=\n\s*\(?[A-Da-d][).]|$)',
            _re.DOTALL
        )
        matches = option_pattern.findall(text)
        options = {}
        if len(matches) >= 2:
            for i, (_, opt_text) in enumerate(matches[:4]):
                options[f"option{i+1}"] = opt_text.strip()
            # Strip options from the stem
            first_option_pos = text.find(matches[0][1][:10]) if matches else -1
            if first_option_pos > 10:
                text = text[:first_option_pos].strip()

        row = {
            "qtext": text,
            "qimage": None,
            "type": "mcq",
            "section": section,
            "option1": options.get("option1"),
            "option2": options.get("option2"),
            "option3": options.get("option3"),
            "option4": options.get("option4"),
            "correctans": None,
        }

        images = q_data.get("images", [])
        if images:
            row["qimage"] = images[0]

        return row

    def _upload_current_to_supabase(self):
        """Save the current question locally, then upload it to Supabase."""
        if not self.questions:
            QMessageBox.warning(self, "Upload", "No questions loaded.")
            return

        # First save it locally
        self._save_question("text_only")

        supabase = self._get_supabase_client()
        if not supabase:
            return

        section = self.section_combo.currentText()
        question = self.questions[self.current_question_index]

        # Load the just-saved data from storage
        saved = self.storage.find_question_by_qid(question.qid)
        if not saved:
            QMessageBox.warning(self, "Upload", "Question not found in local storage.\nSave it first.")
            return

        row = self._build_supabase_row(saved, section)
        if not row["qtext"] or len(row["qtext"]) < 10:
            QMessageBox.warning(self, "Upload", "Question text is too short to upload.")
            return

        try:
            result = supabase.table(SUPABASE_TABLE).insert(row).execute()
            if result.data:
                self.statusBar().showMessage(f"☁️ Uploaded Q{question.qid} to Supabase ({section})")
                QMessageBox.information(
                    self, "Upload Successful",
                    f"Question {question.qid} uploaded to Supabase!\nSection: {section}"
                )
            else:
                QMessageBox.warning(self, "Upload", f"Upload returned no data.\nResponse: {result}")
        except Exception as e:
            QMessageBox.critical(self, "Upload Error", str(e))

    def _upload_all_to_supabase(self):
        """Upload all questions in saved_questions/ to Supabase."""
        supabase = self._get_supabase_client()
        if not supabase:
            return

        section = self.section_combo.currentText()
        all_questions = self.storage.get_all_questions()

        if not all_questions:
            QMessageBox.information(self, "Upload", "No saved questions found.\nSave some questions first.")
            return

        reply = QMessageBox.question(
            self, "Confirm Upload",
            f"Upload {len(all_questions)} question(s) to Supabase?\nSection: {section}",
            QMessageBox.Yes | QMessageBox.No
        )
        if reply != QMessageBox.Yes:
            return

        # Get existing question texts to avoid duplicates
        try:
            existing_resp = supabase.table(SUPABASE_TABLE).select("qtext").eq("section", section).execute()
            existing_texts = {r["qtext"] for r in (existing_resp.data or []) if r.get("qtext")}
        except Exception:
            existing_texts = set()

        uploaded = 0
        skipped = 0
        errors = 0

        for q_data in all_questions:
            try:
                row = self._build_supabase_row(q_data, section)
                qtext = row.get("qtext", "")

                if not qtext or len(qtext) < 10:
                    skipped += 1
                    continue

                if qtext in existing_texts:
                    skipped += 1
                    continue

                result = supabase.table(SUPABASE_TABLE).insert(row).execute()
                if result.data:
                    existing_texts.add(qtext)
                    uploaded += 1
                else:
                    errors += 1
            except Exception as e:
                print(f"[upload error] {e}")
                errors += 1

        self.statusBar().showMessage(
            f"☁️ Upload done — {uploaded} uploaded, {skipped} skipped, {errors} errors"
        )
        QMessageBox.information(
            self, "Upload Complete",
            f"Uploaded: {uploaded}\nSkipped (duplicates/short): {skipped}\nErrors: {errors}"
        )


# -----------------------------
# Main Entry Point
# -----------------------------
def main():
    print("=" * 60)
    print("Question Selector GUI - PDF Question Bank Parser")
    print("=" * 60)
    
    if not OCR_AVAILABLE:
        print("[warn] OCR not available. Install pytesseract for OCR features:")
        print("       pip install pytesseract")
        print("       Also install Tesseract OCR on your system:")
        print("       macOS: brew install tesseract")
        print("       Ubuntu: sudo apt install tesseract-ocr")
    
    app = QApplication(sys.argv)
    app.setStyle("Fusion")  # Modern look
    
    window = QuestionSelectorGUI()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
