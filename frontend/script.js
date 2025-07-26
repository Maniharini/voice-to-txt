function startListening() {
  const inputLang = document.getElementById('inputLang').value;
  const translateLang = document.getElementById('translateLang').value;
  showOutput(`🎙️ Listening in ${inputLang}, translating to ${translateLang}...`);
  // You can integrate real microphone logic here
}

function uploadAndTranslate() {
  const file = document.getElementById('audioFile').files[0];
  if (!file) {
    alert('Please select an audio file first.');
    return;
  }

  // Dummy output – replace with actual server call or processing logic
  showOutput(`📤 Uploaded "${file.name}", processing for translation...`);
}

function showOutput(message) {
  const outputDiv = document.getElementById('output');
  outputDiv.style.display = 'block';
  outputDiv.textContent = message;
}
