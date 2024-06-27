import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QFileDialog, QLabel
from pdf2image import convert_from_path

class PDF2IMGConverter(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Batch PDF to Image Converter')
        self.setGeometry(100, 100, 400, 300)
        
        layout = QVBoxLayout()
        
        self.label = QLabel('Select a source folder and a target folder for conversion.', self)
        layout.addWidget(self.label)
        
        btn_open_source = QPushButton('Select Source Folder', self)
        btn_open_source.clicked.connect(self.openSourceDialog)
        layout.addWidget(btn_open_source)

        btn_open_target = QPushButton('Select Target Folder', self)
        btn_open_target.clicked.connect(self.openTargetDialog)
        layout.addWidget(btn_open_target)

        self.setLayout(layout)
        self.source_folder = ''
        self.target_folder = ''

    def openSourceDialog(self):
        folder_path = QFileDialog.getExistingDirectory(self, "Select Source Folder")
        if folder_path:
            self.source_folder = folder_path
            self.label.setText(f'Selected source folder: {folder_path}')

    def openTargetDialog(self):
        folder_path = QFileDialog.getExistingDirectory(self, "Select Target Folder")
        if folder_path:
            self.target_folder = folder_path
            self.label.setText(f'Selected target folder: {folder_path}')
            self.convertAllPDFs()

    def convertAllPDFs(self):
        if self.source_folder and self.target_folder:
            for filename in os.listdir(self.source_folder):
                if filename.lower().endswith('.pdf'):
                    file_path = os.path.join(self.source_folder, filename)
                    images = convert_from_path(file_path, dpi=300)
                    for i, image in enumerate(images):
                        image_path = os.path.join(self.target_folder, f'{os.path.splitext(filename)[0]}_page_{i+1}.png')
                        image.save(image_path, 'PNG')
            self.label.setText('Conversion completed!')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = PDF2IMGConverter()
    ex.show()
    sys.exit(app.exec_())
