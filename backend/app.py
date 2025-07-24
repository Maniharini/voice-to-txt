from flask import Flask, request, jsonify
import speech_recognition as sr
import os

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    filepath = os.path.join("audio_files", audio_file.filename)
    audio_file.save(filepath)

    recognizer = sr.Recognizer()
    with sr.AudioFile(filepath) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            return jsonify({'text': text})
        except sr.UnknownValueError:
            return jsonify({'error': 'Speech not recognized'}), 500

if __name__ == '__main__':
    app.run(debug=True)
