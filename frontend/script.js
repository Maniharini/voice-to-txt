const form = document.getElementById("uploadForm");
const transcriptEl = document.getElementById("transcript");
const translationEl = document.getElementById("translation");
const downloadLink = document.getElementById("downloadLink");
const speakBtn = document.getElementById("speakBtn");

// File Upload Translation
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const response = await fetch("/upload-audio", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.transcript && data.translation) {
    transcriptEl.textContent = data.transcript;
    translationEl.textContent = data.translation;

    downloadLink.href = data.download;
    downloadLink.style.display = "inline-block";
  } else {
    alert("❌ " + data.error);
  }
};

// Live Mic Translation (Web Speech API + Google Translate API)
let recognition;
let isListening = false;

document.getElementById("startMic").onclick = () => {
  if (isListening) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser doesn't support speech recognition.");
    return;
  }

  const liveTargetLang = document.getElementById("liveTargetLang").value;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = async (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    transcriptEl.textContent = text;

    const translated = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${liveTargetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const result = await translated.json();
    const final = result[0].map(i => i[0]).join("");
    translationEl.textContent = final;

    // Prepare downloadable file
    const blob = new Blob([`Transcript:\n${text}\n\nTranslation:\n${final}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = "inline-block";
  };

  recognition.start();
  isListening = true;
};

document.getElementById("stopMic").onclick = () => {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
};

// Text-to-Speech
speakBtn.onclick = () => {
  const msg = new SpeechSynthesisUtterance(translationEl.textContent);
  window.speechSynthesis.speak(msg);
};
