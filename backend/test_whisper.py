import whisper
import os

# ✅ Get full path to audio file
current_dir = os.path.dirname(os.path.abspath(__file__))
audio_path = os.path.join(current_dir, "hello_test.wav")  # Replace with your file name if different

# ✅ Load Whisper model
model = whisper.load_model("base")  # You can also try "tiny" or "medium"

# ✅ Transcribe the audio
result = model.transcribe(audio_path)

# ✅ Print output
print("🧠 Full Result:", result)
print("📝 Transcript:", result["text"])
