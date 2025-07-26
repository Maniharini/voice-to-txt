// Upload audio file and process it through Flask + Whisper
function uploadAudio() {
  const fileInput = document.getElementById('audioFile');
  const targetLang = document.getElementById("languageSelect").value;
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an audio file.");
    return;
  }

  const formData = new FormData();
  formData.append("audio", file);
  formData.append("targetLang", targetLang);

  fetch("http://127.0.0.1:5000/upload-audio", {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      const transcript = data.transcript || "❌ Failed to transcribe.";
      const translation = data.translation || "❌ Failed to translate.";

      document.getElementById("audioResult").textContent = `📝 Transcript: ${transcript}`;
      document.getElementById("audioTranslation").textContent = `🌍 Translated: ${translation}`;
    })
    .catch(err => {
      console.error("Upload error:", err);
      alert("❌ Failed to process audio.");
    });
}

// Start live microphone input and speech recognition
function startListeningWithTranslation() {
  const result = document.getElementById("liveResult");
  const translated = document.getElementById("translatedText");

  const inputLang = document.getElementById("inputLanguage").value;
  const targetLang = document.getElementById("languageSelect").value;

  if (!('webkitSpeechRecognition' in window)) {
    result.textContent = "❌ Your browser doesn't support speech recognition.";
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = inputLang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  result.textContent = "🎤 Listening...";

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    result.textContent = "📝 You said: " + transcript;

    // Translate the transcribed speech
    translateText(transcript, targetLang);
  };

  recognition.onerror = function(event) {
    result.textContent = "❌ Error: " + event.error;
  };
}

// Translate plain text using Google Translate API
function translateText(text, targetLang) {
  fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(data => {
      const translated = data[0][0][0] || "❌ Translation failed.";
      document.getElementById("translatedText").textContent = `🌍 Translated: ${translated}`;
    })
    .catch(err => {
      console.error("Translation error:", err);
      document.getElementById("translatedText").textContent = "❌ Error translating.";
    });
}
