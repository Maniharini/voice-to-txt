function startListening() {
  const inputLang = document.getElementById('inputLang').value;
  const translateLang = document.getElementById('translateLang').value;
  showOutput(`🎙️ Listening in ${inputLang}, translating to ${translateLang}... (mic logic placeholder)`);
  // 🔊 Integrate live mic + Web Speech API if needed
}

async function uploadAndTranslate() {
  const file = document.getElementById('audioFile').files[0];
  const targetLang = document.getElementById('translateLang').value;

  if (!file) {
    alert('Please select an audio file first.');
    return;
  }

  const formData = new FormData();
  formData.append('audio', file);
  formData.append('targetLang', targetLang);

  showOutput("📤 Uploading and processing...");

  const response = await fetch('http://127.0.0.1:5000/upload-audio', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (data.error) {
    showOutput(`❌ ${data.error}`);
  } else {
    const output = `📝 You said:\n${data.transcript}\n\n🌍 Translated:\n${data.translation}\n\n⬇️ <a href="http://127.0.0.1:5000/download/${data.download}" target="_blank">Download TXT File</a>`;
    showOutput(output, true);
  }
}

function showOutput(message, html = false) {
  const outputDiv = document.getElementById('output');
  outputDiv.style.display = 'block';
  outputDiv.innerHTML = html ? message : `<pre>${message}</pre>`;
}
