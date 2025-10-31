const urlBar = document.getElementById('urlBar');
const goBtn = document.getElementById('goBtn');
const webview = document.getElementById('webview');

goBtn.addEventListener('click', () => {
  let url = urlBar.value;
  if (!url.startsWith('http')) url = 'https://' + url;
  webview.src = url;
});
