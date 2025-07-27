
from flask import Flask, request, jsonify, send_file
import whisper
import os
import requests
from flask_cors import CORS
from datetime import datetime

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

    filename = f"temp_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file.save(filename)

    try:
        result = model.transcribe(filename)
        transcript = result["text"].strip()

        if not transcript:
            os.remove(filename)
            return jsonify({"error": "No speech detected."}), 400

        translation = translate_text(transcript, target_lang)

        # Save results to .txt
        output_filename = f"result_{datetime.now().strftime('%H%M%S')}.txt"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(f"📝 Transcript:\n{transcript}\n\n🌍 Translation:\n{translation}")

        os.remove(filename)

        return jsonify({
            "transcript": transcript,
            "translation": translation,
            "download": output_filename
        })

    except Exception as e:
        if os.path.exists(filename):
            os.remove(filename)
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    path = os.path.join(os.getcwd(), filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
