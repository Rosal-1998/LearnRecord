from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein

def calculate_jaccard_similarity(set1, set2):
    intersection_size = len(set1.intersection(set2))
    union_size = len(set1.union(set2))
    return intersection_size / union_size

# 定义两个句子
sentence1 = "疑似银河落九天。"
sentence2 = "日照香炉生九烟"

# 计算编辑距离
levenshtein_similarity = 1 - Levenshtein.distance(sentence1, sentence2) / max(len(sentence1), len(sentence2))

# 计算Jaccard相似度
words1 = set(sentence1.split())
words2 = set(sentence2.split())
jaccard_similarity = calculate_jaccard_similarity(words1, words2)

# 计算基于TF-IDF的余弦相似度
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform([sentence1, sentence2])
cosine_similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

print(f"Levenshtein similarity: {levenshtein_similarity}")
print(f"Jaccard similarity: {jaccard_similarity}")
print(f"Cosine similarity (TF-IDF): {cosine_similarity_score}")
