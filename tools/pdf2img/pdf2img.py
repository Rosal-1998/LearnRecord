from pdf2image import convert_from_path

# 指定PDF文件路径
pdf_path = 'test.pdf'

# 转换PDF为图片，这里设置了高分辨率
images = convert_from_path(pdf_path, dpi=100)

# 保存图片
for i, image in enumerate(images):
    image.save(f'page_{i+1}.png', 'PNG')
