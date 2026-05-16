#!/usr/bin/env python3
"""
upload_to_supabase.py
=====================
Uploads questions saved by question_selector_gui.py to Supabase.

Usage:
    python upload_to_supabase.py [--saved-dir PATH] [--section SECTION] [--dry-run]

Examples:
    # Upload all saved questions as 'Electronics Aptitude'
    python upload_to_supabase.py --section "Electronics Aptitude"

    # Preview what would be uploaded (no writes)
    python upload_to_supabase.py --section "Analog Electronics" --dry-run

    # Specify a custom saved_questions directory
    python upload_to_supabase.py --saved-dir /path/to/saved_questions --section "Digital Electronics"

Supported sections (must match exactly):
    - Analog Electronics
    - Digital Electronics
    - C / Embedded Systems
    - Electronics Aptitude

Requirements:
    pip install supabase python-dotenv
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path
from typing import Optional

# ── load .env from project root (two levels up from scripts/) ──────────────
try:
    from dotenv import load_dotenv
    # Walk up to find .env relative to this script
    script_dir = Path(__file__).resolve().parent
    # scripts/ -> mock/ -> app/ -> src/ -> project root
    project_root = script_dir.parent.parent.parent.parent.parent
    env_file = project_root / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"[info] Loaded .env from {env_file}")
    else:
        load_dotenv()  # fallback: current dir
except ImportError:
    print("[warn] python-dotenv not installed. Reading env vars from shell.")

try:
    from supabase import create_client, Client
except ImportError:
    print("[error] supabase package not installed.")
    print("        Run: pip install supabase")
    sys.exit(1)

# ── Constants ──────────────────────────────────────────────────────────────
TABLE_NAME = "phoenix-website_mock_oa"

VALID_SECTIONS = [
    "Analog Electronics",
    "Digital Electronics",
    "C / Embedded Systems",
    "Electronics Aptitude",
]

# ── Helpers ────────────────────────────────────────────────────────────────

def get_supabase_client() -> Client:
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    # Prefer service role key for writes; fall back to publishable/anon key
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    )

    if not url or not key:
        print("[error] Missing Supabase credentials.")
        print("        Set NEXT_PUBLIC_SUPABASE_URL and either")
        print("        SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        print("        in your .env file.")
        sys.exit(1)

    return create_client(url, key)


def parse_options_from_text(text: str):
    """
    Try to parse MCQ options from plain question text.
    Looks for patterns like:
        (A) ... (B) ... (C) ... (D) ...
        A) ...  B) ...
        a. ...  b. ...
    Returns a dict with option1..option4 or None if not found.
    """
    patterns = [
        r'\(([A-Da-d])\)\s*(.+?)(?=\([A-Da-d]\)|$)',
        r'([A-Da-d])\)\s*(.+?)(?=[A-Da-d]\)|$)',
        r'([A-Da-d])\.\s*(.+?)(?=[A-Da-d]\.|$)',
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text, re.DOTALL)
        if len(matches) >= 2:
            options = {}
            for i, (_, opt_text) in enumerate(matches[:4]):
                options[f"option{i+1}"] = opt_text.strip()
            return options

    return None


def load_saved_questions(saved_dir: str):
    """Load all questions from the saved_questions index."""
    index_file = os.path.join(saved_dir, "index.json")

    if not os.path.exists(index_file):
        print(f"[error] index.json not found in: {saved_dir}")
        print("        Run question_selector_gui.py first to save questions.")
        sys.exit(1)

    with open(index_file, "r", encoding="utf-8") as f:
        index = json.load(f)

    questions = []
    for q_info in index.get("questions", []):
        folder = q_info.get("folder", "")
        q_dir = os.path.join(saved_dir, folder)
        q_json = os.path.join(q_dir, "question.json")

        if os.path.exists(q_json):
            with open(q_json, "r", encoding="utf-8") as f:
                q_data = json.load(f)
                questions.append(q_data)
        else:
            # Fall back to index info
            questions.append(q_info)

    return questions


def build_supabase_row(q_data: dict, section: str) -> dict:
    """
    Build a row for phoenix-website_mock_oa from saved question data.
    """
    text = q_data.get("text") or q_data.get("ocr_text") or ""
    text = text.strip()

    # Try to parse options embedded in the question text
    parsed_options = parse_options_from_text(text)

    # If options were parsed, strip them from the main question text
    if parsed_options:
        # Remove the options portion from text (keep only the question stem)
        clean_text = re.split(
            r'\([A-Da-d]\)\s*|\s[A-Da-d]\)\s*|\s[A-Da-d]\.\s*',
            text, maxsplit=1
        )[0].strip()
        if len(clean_text) > 10:
            text = clean_text

    row = {
        "qtext": text,
        "qimage": None,
        "type": "mcq",
        "section": section,
        "option1": None,
        "option2": None,
        "option3": None,
        "option4": None,
        "correctans": None,
    }

    # Add parsed options if found
    if parsed_options:
        row.update(parsed_options)

    # Check for image in saved question
    images = q_data.get("images", [])
    custom_regions = q_data.get("custom_regions", [])

    # Use first image if available (store path reference or URL)
    if images:
        row["qimage"] = images[0]  # local filename; upload separately if needed
    elif custom_regions:
        for region in custom_regions:
            if region.get("image"):
                row["qimage"] = region["image"]
                break

    return row


def upload_questions(
    questions: list,
    section: str,
    supabase: Client,
    dry_run: bool = False,
    skip_existing: bool = True,
):
    """Upload questions to Supabase."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Uploading {len(questions)} questions → section: '{section}'")
    print("-" * 60)

    # Get existing question texts to avoid duplicates
    existing_texts = set()
    if skip_existing and not dry_run:
        resp = supabase.table(TABLE_NAME).select("qtext").eq("section", section).execute()
        if resp.data:
            existing_texts = {r["qtext"] for r in resp.data if r.get("qtext")}
        print(f"[info] {len(existing_texts)} existing questions in section (will skip duplicates)")

    uploaded = 0
    skipped = 0
    errors = 0

    for i, q_data in enumerate(questions):
        try:
            row = build_supabase_row(q_data, section)

            qtext = row["qtext"]
            if not qtext or len(qtext) < 10:
                print(f"  [{i+1}] ⚠  Skipped (text too short): {repr(qtext[:40])}")
                skipped += 1
                continue

            if qtext in existing_texts:
                print(f"  [{i+1}] ⏭  Already exists: {qtext[:60]}...")
                skipped += 1
                continue

            if dry_run:
                print(f"  [{i+1}] 👁  Would upload: {qtext[:80]}...")
                print(f"        options: {[row.get(f'option{k}') for k in range(1,5)]}")
                uploaded += 1
            else:
                result = supabase.table(TABLE_NAME).insert(row).execute()
                if result.data:
                    print(f"  [{i+1}] ✅ Uploaded: {qtext[:70]}...")
                    existing_texts.add(qtext)
                    uploaded += 1
                else:
                    print(f"  [{i+1}] ❌ Failed:   {qtext[:70]}")
                    errors += 1

        except Exception as e:
            print(f"  [{i+1}] ❌ Error: {e}")
            errors += 1

    print("-" * 60)
    action = "Would upload" if dry_run else "Uploaded"
    print(f"{action}: {uploaded}  |  Skipped: {skipped}  |  Errors: {errors}")
    return uploaded, skipped, errors


# ── CLI ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Upload saved questions from question_selector_gui.py to Supabase"
    )
    parser.add_argument(
        "--saved-dir",
        default="saved_questions",
        help="Path to the saved_questions directory (default: ./saved_questions)",
    )
    parser.add_argument(
        "--section",
        required=True,
        choices=VALID_SECTIONS,
        metavar="SECTION",
        help=f"Target section. One of: {', '.join(VALID_SECTIONS)}",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be uploaded without writing to Supabase",
    )
    parser.add_argument(
        "--allow-duplicates",
        action="store_true",
        help="Upload even if question text already exists in the table",
    )

    args = parser.parse_args()

    print("=" * 60)
    print("  Supabase Question Uploader")
    print("=" * 60)
    print(f"  Saved dir : {args.saved_dir}")
    print(f"  Section   : {args.section}")
    print(f"  Dry run   : {args.dry_run}")
    print(f"  Table     : {TABLE_NAME}")
    print("=" * 60)

    # Load questions from local storage
    questions = load_saved_questions(args.saved_dir)
    print(f"[info] Found {len(questions)} question(s) in {args.saved_dir}")

    if not questions:
        print("[warn] No questions to upload. Save some questions with the GUI first.")
        return

    # Connect to Supabase
    if not args.dry_run:
        supabase = get_supabase_client()
        print("[info] Connected to Supabase ✓")
    else:
        supabase = None

    # Upload
    upload_questions(
        questions=questions,
        section=args.section,
        supabase=supabase,
        dry_run=args.dry_run,
        skip_existing=not args.allow_duplicates,
    )


if __name__ == "__main__":
    main()
