import cv2
import numpy as np
import matplotlib.pyplot as plt

# 读取图片
image_path = '1.jpg'  # 替换为你的图片路径
image = cv2.imread(image_path)

# 将图片的通道拆分
blue_channel, green_channel, red_channel = cv2.split(image)

# 创建一个全零数组，与图像大小相同
zeros = np.zeros_like(blue_channel)

# 为了可视化，将其他两个通道置零
red_channel_only = cv2.merge([zeros, zeros, red_channel])
green_channel_only = cv2.merge([zeros, green_channel, zeros])
blue_channel_only = cv2.merge([blue_channel, zeros, zeros])

# 保存三个通道的图像
cv2.imwrite('red_channel.jpg', red_channel_only)
cv2.imwrite('green_channel.jpg', green_channel_only)
cv2.imwrite('blue_channel.jpg', blue_channel_only)

# 可视化三个通道
plt.figure(figsize=(10, 5))

plt.subplot(1, 4, 1)
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.title('Original Image')

plt.subplot(1, 4, 2)
plt.imshow(red_channel_only)
plt.title('Red Channel')

plt.subplot(1, 4, 3)
plt.imshow(green_channel_only)
plt.title('Green Channel')

plt.subplot(1, 4, 4)
plt.imshow(blue_channel_only)
plt.title('Blue Channel')

plt.show()
