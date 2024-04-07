from PIL import Image

def pixelate_image(input_image_path, pixel_size):
    # 打开图像
    image = Image.open(input_image_path)
    
    # 计算缩小后的尺寸
    small_image = image.resize(
        (image.size[0]//pixel_size, image.size[1]//pixel_size),
        resample=Image.BILINEAR
    )
    
    # 再放大回原来尺寸，实现像素风格
    result_image = small_image.resize(
        image.size,
        Image.NEAREST
    )
    
    return result_image

# 输入想要像素化的图像的路径
input_image_path = '1123.jpg'
# 想要的像素大小（例如：10x10）
pixel_size = 20

# 获取像素化图像
pixelated_image = pixelate_image(input_image_path, pixel_size)

# 显示图像（可选）
pixelated_image.show()

# 保存像素化后的图像到新文件中
pixelated_image.save('path_to_save_pixelated_image.png')