# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein

def calculate_levenshtein_similarity(sentence, sentences_array):
    # 计算编辑距离
    levenshtein_similarities = []
    for other_sentence in sentences_array:
        print(other_sentence)
        levenshtein_similarity = 1 - Levenshtein.distance(sentence, other_sentence) / max(len(sentence), len(other_sentence))
        levenshtein_similarities.append(levenshtein_similarity)
    return levenshtein_similarities

# 定义两个句子
sentence1 = "疑似银河落九天。"
sentence2 = "日照香炉生九烟"

# 测试函数
sentences_array = [sentence1, sentence2]  # 这里可以替换为从B.py传递过来的句子数组
levenshtein_similarities = calculate_levenshtein_similarity(sentence2, sentences_array)
print(f"Levenshtein similarities: {levenshtein_similarities}")
