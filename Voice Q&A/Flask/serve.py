from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'audioFile' not in request.files:
            return jsonify({'message': 'No audio file part'}), 400
        file = request.files['audioFile']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        if file:
            # 在这里处理音频文件，例如保存到服务器
            filename = 'uploaded_audio.wav'
            file.save(filename)
            return jsonify({'message': 'File successfully uploaded', 'filename': filename}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


@app.route("/hello",methods=['GET','POST'])
def hello():
    return "Hello World!"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
