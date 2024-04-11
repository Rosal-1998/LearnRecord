import fitz

def draw_rect_on_pdf(pdf_path, page_number, rect, output_pdf_path):
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_number)  # 页码从0开始
    # rect的格式是[x0, y0, x1, y1]
    shape = page.new_shape()
    red_color = (1, 0, 0)
    
    # 绘制矩形框，指定颜色为红色
    shape.draw_rect(rect)
    shape.finish(color=red_color, fill=None, width=1.5)  # 设置线条颜色为红色，线条宽度为1.5
    shape.commit()
    doc.save(output_pdf_path)
    doc.close()

# 示例使用
pdf_path = '15.pdf'
output_pdf_path = 'marked_pdf.pdf'
page_number = 2  # 第一页
rect = [1,33, 215, 158]  # 初步估计的位置和大小
draw_rect_on_pdf(pdf_path, page_number, rect, output_pdf_path)
