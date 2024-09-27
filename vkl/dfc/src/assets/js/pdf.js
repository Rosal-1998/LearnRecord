import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadPDF = page => {
  html2canvas(page).then(function(canvas) {
    canvas2PDF(canvas);
  });
};

const canvas2PDF = canvas => {
  let contentWidth = canvas.width;
  let contentHeight = canvas.height;
  let imgHeight = contentHeight;
  let imgWidth = contentWidth;
  let pdf = new jsPDF("l", "px", [contentWidth, contentHeight]);

  pdf.addImage(
    canvas.toDataURL("image/jpeg", 1.0),
    "JPEG",
    0,
    0,
    imgWidth,
    imgHeight
  );
  //导出文件的名字，可以自定义
  pdf.save("运行图.pdf");
};

