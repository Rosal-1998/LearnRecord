from flask import Flask, request, jsonify
from flask_cors import CORS
from speechRecognition import RequestApi
import similarity
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/test', methods=['POST'])
def test():
    print('---上传文件了---')
    answerList = request.form['answerList']
    print('111111',answerList)
    answerList = json.loads(answerList)
    print('2222',answerList)
    return '11'


@app.route('/upload', methods=['POST'])
def upload():
    print('---上传文件了---')
    print(request.files)
    print('request',request.form)
    try:
        if 'audioFile' not in request.files:
            print('-1-')
            return jsonify({'message': 'No audio file part'}), 400
        file = request.files['audioFile']
        if file.filename == '':
            print('-2-')
            return jsonify({'message': 'No selected file'}), 400
        if file:
            print('-3-')
            # 在这里处理音频文件，例如保存到服务器
            filename = 'uploaded_audio.wav'
            file.save(filename)
            api = RequestApi(
                appid="94a95883",
                secret_key="f8846c003e3963841ac10a0c7fe01ac7",
                upload_file_path=r"uploaded_audio.wav"
            )
            result = api.get_result()

            answerList = request.form['answerList']
            print('1',answerList)
            answerList = json.loads(answerList)

            # print('2',answerList)

            scoreArray = similarity.calculate_levenshtein_similarity(result,answerList)
            print(scoreArray)
            # return jsonify({'message': 'File successfully uploaded', 'filename': filename}), 200
            return jsonify({'result':scoreArray}),200
    except Exception as e:
        print('-4-')
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


@app.route("/hello",methods=['GET','POST'])
def hello():
    return "Hello World!"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
