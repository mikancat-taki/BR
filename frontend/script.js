const urlBar = document.getElementById('urlBar');
const goBtn = document.getElementById('goBtn');
const newTabBtn = document.getElementById('newTabBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const historyBtn = document.getElementById('historyBtn');

const tabsDiv = document.getElementById('tabs');
const webviewsDiv = document.getElementById('webviews');
const bookmarksPanel = document.getElementById('bookmarksPanel');
const bookmarksList = document.getElementById('bookmarksList');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

let tabs = [];
let activeTab = 0;

// タブ作成
function createTab(url = 'https://www.google.com') {
  const index = tabs.length;

  const tabBtn = document.createElement('div');
  tabBtn.className = 'tab';
  tabBtn.textContent = 'New Tab';

  const closeBtn = document.createElement('span');
  closeBtn.textContent = '×';
  closeBtn.className = 'closeBtn';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeTab(index);
  };
  tabBtn.appendChild(closeBtn);

  tabBtn.addEventListener('click', () => switchTab(index));
  tabsDiv.appendChild(tabBtn);

  const webview = document.createElement('iframe');
  webview.className = 'webview';
  webview.src = url;
  webview.style.display = 'none';
  webviewsDiv.appendChild(webview);

  tabs.push({ tabBtn, webview });
  switchTab(index);
  addHistory(url);
}

// タブ切替
function switchTab(index) {
  tabs.forEach((t, i) => {
    t.webview.style.display = i === index ? 'block' : 'none';
    t.tabBtn.classList.toggle('active', i === index);
  });
  activeTab = index;
  urlBar.value = tabs[activeTab].webview.src;
}

// タブ閉じる
function closeTab(index) {
  const t = tabs[index];
  tabsDiv.removeChild(t.tabBtn);
  webviewsDiv.removeChild(t.webview);
  tabs.splice(index, 1);
  if (activeTab >= tabs.length) activeTab = tabs.length - 1;
  if (tabs.length) switchTab(activeTab);
}

// URL移動
goBtn.addEventListener('click', () => {
  let url = urlBar.value;
  if (!url.startsWith('http')) url = 'https://' + url;
  tabs[activeTab].webview.src = url;
  addHistory(url);
});

// 新しいタブ
newTabBtn.addEventListener('click', () => createTab());

// ダークモード
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// ブックマーク
bookmarkBtn.addEventListener('click', async () => {
  const currentUrl = tabs[activeTab].webview.src;
  await fetch('http://localhost:10000/api/bookmarks', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url: currentUrl})
  });
  renderBookmarks();
  bookmarksPanel.classList.toggle('hidden');
});

async function renderBookmarks() {
  const res = await fetch('http://localhost:10000/api/bookmarks');
  const data = await res.json();
  bookmarksList.innerHTML = '';
  data.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.onclick = () => {
      tabs[activeTab].webview.src = url;
      bookmarksPanel.classList.add('hidden');
      addHistory(url);
    };
    bookmarksList.appendChild(li);
  });
}

// 履歴
historyBtn.addEventListener('click', async () => {
  historyPanel.classList.toggle('hidden');
  renderHistory();
});

async function addHistory(url) {
  await fetch('http://localhost:10000/api/history', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url})
  });
}

async function renderHistory() {
  const res = await fetch('http://localhost:10000/api/history');
  const data = await res.json();
  historyList.innerHTML = '';
  data.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.onclick = () => {
      tabs[activeTab].webview.src = url;
      historyPanel.classList.add('hidden');
      addHistory(url);
    };
    historyList.appendChild(li);
  });
}

// 初期化
createTab();
