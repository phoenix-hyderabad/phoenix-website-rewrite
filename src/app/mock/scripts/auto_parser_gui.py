#!/usr/bin/env python3
"""
auto_parser_gui.py
==================
A PyQt5 Desktop Application to wrap the automated PDF parser.
Provides a simple GUI to select a PDF, choose a section, and run the parser 
with real-time log output.
"""

import sys
import os
import subprocess
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QFileDialog, QComboBox, QTextEdit, QMessageBox
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QFont, QColor, QTextCursor

class WorkerThread(QThread):
    """Runs the subprocess and captures output so the GUI doesn't freeze."""
    output_signal = pyqtSignal(str)
    finished_signal = pyqtSignal(int)

    def __init__(self, script_path, pdf_path, section):
        super().__init__()
        self.script_path = script_path
        self.pdf_path = pdf_path
        self.section = section
        self.process = None

    def run(self):
        try:
            # Use unbuffered output (-u) so we get logs in real-time
            cmd = [sys.executable, "-u", self.script_path, "--pdf", self.pdf_path, "--section", self.section]
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )

            for line in self.process.stdout:
                self.output_signal.emit(line)
                
            self.process.wait()
            self.finished_signal.emit(self.process.returncode)
            
        except Exception as e:
            self.output_signal.emit(f"[error] Subprocess failed: {e}\n")
            self.finished_signal.emit(-1)


class AutoParserGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Mock OA - Automated PDF Parser")
        self.setMinimumSize(700, 500)
        
        # Script paths
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.parser_script = os.path.join(self.script_dir, "auto_pdf_parser.py")

        self.pdf_path = None
        self.worker = None

        self.initUI()

    def initUI(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)

        # Title
        title_label = QLabel("Automated PDF Question Extractor")
        title_font = QFont("Arial", 16, QFont.Bold)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(title_label)
        
        # Subtitle
        sub_label = QLabel("Extracts text & images, auto-maps them, and uploads to Supabase.")
        sub_label.setAlignment(Qt.AlignCenter)
        sub_label.setStyleSheet("color: #555;")
        main_layout.addWidget(sub_label)

        # Controls Layout
        controls_layout = QVBoxLayout()
        
        # File Selection
        file_layout = QHBoxLayout()
        self.file_label = QLabel("No PDF selected")
        self.file_label.setStyleSheet("border: 1px solid #ccc; padding: 5px; background: #fff;")
        btn_browse = QPushButton("Browse PDF")
        btn_browse.clicked.connect(self.browse_pdf)
        file_layout.addWidget(self.file_label, stretch=1)
        file_layout.addWidget(btn_browse)
        controls_layout.addLayout(file_layout)

        # Section Selection
        section_layout = QHBoxLayout()
        section_label = QLabel("Target Database Section:")
        self.combo_section = QComboBox()
        self.combo_section.addItems([
            "Analog Electronics",
            "Digital Electronics",
            "C / Embedded Systems",
            "Electronics Aptitude"
        ])
        section_layout.addWidget(section_label)
        section_layout.addWidget(self.combo_section, stretch=1)
        controls_layout.addLayout(section_layout)

        main_layout.addLayout(controls_layout)

        # Run Button
        self.btn_run = QPushButton("Start Automated Parsing && Upload")
        self.btn_run.setStyleSheet("""
            QPushButton {
                background-color: #2563eb; 
                color: white; 
                font-size: 14px; 
                font-weight: bold; 
                padding: 10px; 
                border-radius: 5px;
            }
            QPushButton:hover { background-color: #1d4ed8; }
            QPushButton:disabled { background-color: #94a3b8; }
        """)
        self.btn_run.clicked.connect(self.run_parser)
        main_layout.addWidget(self.btn_run)

        # Log Output
        log_label = QLabel("Execution Log:")
        main_layout.addWidget(log_label)
        
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setFont(QFont("Consolas", 10))
        self.log_output.setStyleSheet("background-color: #1e1e1e; color: #d4d4d4;")
        main_layout.addWidget(self.log_output, stretch=1)

    def browse_pdf(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select Exam PDF", "", "PDF Files (*.pdf)", options=options
        )
        if file_path:
            self.pdf_path = file_path
            self.file_label.setText(file_path)

    def log_message(self, text, color="#d4d4d4"):
        """Append colored text to the log console."""
        # Simple coloring for different log types
        if "✅" in text: color = "#4ade80"
        elif "❌" in text or "error" in text.lower(): color = "#f87171"
        elif "⚠" in text or "warn" in text.lower(): color = "#facc15"
        elif "[*]" in text: color = "#60a5fa"
        
        html_text = f'<span style="color: {color};">{text}</span>'
        self.log_output.moveCursor(QTextCursor.End)
        self.log_output.insertHtml(html_text.replace('\n', '<br>'))
        self.log_output.moveCursor(QTextCursor.End)

    def run_parser(self):
        if not self.pdf_path:
            QMessageBox.warning(self, "Warning", "Please select a PDF file first.")
            return
            
        if not os.path.exists(self.parser_script):
            QMessageBox.critical(self, "Error", f"Parser script not found:\n{self.parser_script}")
            return

        section = self.combo_section.currentText()
        
        # Disable UI
        self.btn_run.setEnabled(False)
        self.btn_run.setText("Parsing in progress...")
        self.log_output.clear()
        self.log_message(f"Starting pipeline for '{section}'...\n\n")

        # Start thread
        self.worker = WorkerThread(self.parser_script, self.pdf_path, section)
        self.worker.output_signal.connect(self.log_message)
        self.worker.finished_signal.connect(self.on_finished)
        self.worker.start()

    def on_finished(self, returncode):
        self.btn_run.setEnabled(True)
        self.btn_run.setText("Start Automated Parsing && Upload")
        
        if returncode == 0:
            self.log_message("\n\n✅ Parsing Pipeline Completed Successfully!", color="#4ade80")
            QMessageBox.information(self, "Success", "Parsing completed successfully!")
        else:
            self.log_message(f"\n\n❌ Pipeline Failed with exit code {returncode}.", color="#f87171")
            QMessageBox.critical(self, "Error", "Parsing failed. Check the log for details.")


if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    gui = AutoParserGUI()
    gui.show()
    sys.exit(app.exec_())
