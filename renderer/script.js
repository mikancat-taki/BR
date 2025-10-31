const urlBar = document.getElementById('urlBar');
const goBtn = document.getElementById('goBtn');
const newTabBtn = document.getElementById('newTabBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const tabsDiv = document.getElementById('tabs');
const webviewsDiv = document.getElementById('webviews');
const bookmarksPanel = document.getElementById('bookmarksPanel');
const bookmarksList = document.getElementById('bookmarksList');

let tabs = [];
let activeTab = 0;
let bookmarks = [];

// タブ作成
function createTab(url = 'https://www.google.com') {
  const index = tabs.length;

  // タブボタン
  const tabBtn = document.createElement('div');
  tabBtn.className = 'tab';
  tabBtn.textContent = 'New Tab';
  tabBtn.addEventListener('click', () => switchTab(index));
  tabsDiv.appendChild(tabBtn);

  // Webview
  const webview = document.createElement('iframe');
  webview.className = 'webview';
  webview.src = url;
  webview.style.display = 'none';
  webviewsDiv.appendChild(webview);

  tabs.push({ tabBtn, webview });
  switchTab(index);
}

// タブ切り替え
function switchTab(index) {
  tabs.forEach((t, i) => {
    t.webview.style.display = i === index ? 'block' : 'none';
    t.tabBtn.classList.toggle('active', i === index);
  });
  activeTab = index;
  urlBar.value = tabs[activeTab].webview.src;
}

// URLバーから移動
goBtn.addEventListener('click', () => {
  let url = urlBar.value;
  if (!url.startsWith('http')) url = 'https://' + url;
  tabs[activeTab].webview.src = url;
});

// 新しいタブ
newTabBtn.addEventListener('click', () => createTab());

// ブックマーク
bookmarkBtn.addEventListener('click', async () => {
  const currentUrl = tabs[activeTab].webview.src;
  if (!bookmarks.includes(currentUrl)) {
    bookmarks.push(currentUrl);
    await window.electronAPI.saveBookmarks(bookmarks);
    renderBookmarks();
  }
  bookmarksPanel.classList.toggle('hidden');
});

function renderBookmarks() {
  bookmarksList.innerHTML = '';
  bookmarks.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.addEventListener('click', () => {
      tabs[activeTab].webview.src = url;
      bookmarksPanel.classList.add('hidden');
    });
    bookmarksList.appendChild(li);
  });
}

// ダークモード切替
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// 初期化
(async function init() {
  bookmarks = await window.electronAPI.loadBookmarks();
  renderBookmarks();
  createTab();
})();
