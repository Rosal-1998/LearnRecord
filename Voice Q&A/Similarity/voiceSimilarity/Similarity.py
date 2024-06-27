import numpy as np
import librosa
from scipy.spatial.distance import cosine

def extract_mfcc(audio_path, sr=16000):
    # 加载音频文件
    y, _ = librosa.load(audio_path, sr=sr)
    
    # 音量标准化
    y = librosa.util.normalize(y)
    
    # 提取MFCC特征
    mfcc = librosa.feature.mfcc(y=y, sr=sr)
    
    # 计算MFCC特征的均值
    mean_mfcc = np.mean(mfcc, axis=1)
    
    return mean_mfcc

def calculate_similarity(feature1, feature2):
    # 使用余弦相似度来计算特征向量之间的相似度
    similarity = 1 - cosine(feature1, feature2)
    return similarity

# 定义两个音频文件的路径
audio_path1 = 'Q3.mp3'
audio_path2 = 'A1.mp3'

# 提取音频特征
feature1 = extract_mfcc(audio_path1)
feature2 = extract_mfcc(audio_path2)

# 计算相似度
similarity = calculate_similarity(feature1, feature2)

print(f"The similarity between the two audio files is: {similarity}")
