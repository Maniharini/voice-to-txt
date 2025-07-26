from flask import Flask, request, jsonify
import whisper
import os
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = whisper.load_model("base")

def translate_text(text, target_lang):
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={target_lang}&dt=t&q={text}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return ''.join([seg[0] for seg in data[0]])
    return "Translation failed."

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    file = request.files.get('audio')
    target_lang = request.form.get("targetLang", "en")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = f"temp_{file.filename}"
    file.save(filepath)

    try:
        result = model.transcribe(filepath)
        transcript = result["text"].strip()

        if not transcript:
            os.remove(filepath)
            return jsonify({"error": "No speech detected in audio."}), 400

        translation = translate_text(transcript, target_lang)
        os.remove(filepath)

        return jsonify({
            "transcript": transcript,
            "translation": translation
        })

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"Failed to process audio: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
