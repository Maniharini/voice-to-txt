// 🎧 Upload audio file to backend and get transcription
function uploadAudio() {
  const input = document.getElementById("audioInput");
  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("result").textContent = "📝 Text: " + data.text;
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

// 🎙 Live Mic to Text (no translation)
function startListening() {
  const liveResult = document.getElementById("liveResult");

  if (!('webkitSpeechRecognition' in window)) {
    liveResult.textContent = "❌ Your browser doesn't support live voice input.";
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US'; // Default language
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  liveResult.textContent = "🎤 Listening...";

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    liveResult.textContent = "📝 Text: " + transcript;
  };

  recognition.onerror = function(event) {
    liveResult.textContent = "❌ Error: " + event.error;
  };
}

// 🎙 Speak in one language → 🌐 Translate to another
function startListeningWithTranslation() {
  const result = document.getElementById("liveResult");
  const translated = document.getElementById("translatedText");

  // Get selected input and target languages
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

    // Translate
    translateText(transcript, targetLang);
  };

  recognition.onerror = function(event) {
    result.textContent = "❌ Error: " + event.error;
  };
}

// 🌐 Translate function using Google Translate API
function translateText(text, targetLang) {
  fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(data => {
      const translated = data[0][0][0];
      document.getElementById("translatedText").textContent = `🌍 Translated: ${translated}`;
    })
    .catch(err => {
      console.error("Translation error:", err);
    });
}
