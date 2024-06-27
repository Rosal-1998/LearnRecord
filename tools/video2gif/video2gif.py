from moviepy.editor import VideoFileClip

def convert_video_to_gif(video_path, gif_path, start_time, end_time, fps=10):
    """
    将视频转换为GIF文件。
    
    参数:
    video_path (str): 视频文件的路径。
    gif_path (str): 输出GIF文件的路径。
    start_time (int): 视频剪辑开始时间（秒）。
    end_time (int): 视频剪辑结束时间（秒）。
    fps (int): 输出GIF的帧率。
    """
    # 加载视频文件
    clip = VideoFileClip(video_path).subclip(start_time, end_time)
    
    # 设置GIF的帧率
    clip = clip.set_fps(fps)
    
    # 写出为GIF
    clip.write_gif(gif_path)

# 示例用法
video_path = 'indexBugFixed2.mp4'
gif_path = 'output2.gif'
start_time = 0  # 从第10秒开始
end_time = 8    # 到第20秒结束

convert_video_to_gif(video_path, gif_path, start_time, end_time)
