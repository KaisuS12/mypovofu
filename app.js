/* ── Name Lock ── */
(function () {
  const VALID      = ['zia', 'quizhia'];
  const lockScreen = document.getElementById('lockScreen');
  const inputRow   = document.querySelector('.lock__input-row');
  const lockInput  = document.getElementById('lockInput');
  const lockHint   = document.getElementById('lockHint');
  const lockPrompt = document.getElementById('lockPrompt');
  const page       = document.querySelector('.page');

  /* Star canvas for lock screen */
  const lc  = document.getElementById('lockStars');
  const lct = lc.getContext('2d');
  let ls    = [];
  function lResize() { lc.width = window.innerWidth; lc.height = window.innerHeight; }
  function lCreate() {
    ls = [];
    for (let i = 0; i < 120; i++) ls.push({
      x: Math.random() * lc.width, y: Math.random() * lc.height,
      size: Math.random() < 0.6 ? 1 : 2, phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.008
    });
  }
  function lDraw() {
    if (!lockScreen || lockScreen.style.display === 'none') return;
    lct.clearRect(0, 0, lc.width, lc.height);
    for (const s of ls) {
      s.phase += s.speed;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
      lct.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      lct.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }
    requestAnimationFrame(lDraw);
  }
  window.addEventListener('resize', () => { lResize(); lCreate(); });
  lResize(); lCreate(); requestAnimationFrame(lDraw);

  /* Skip if already unlocked this session */
  if (sessionStorage.getItem('unlocked') === '1') {
    lockScreen.style.display = 'none';
  } else {
    page.style.opacity = '0';
    page.style.pointerEvents = 'none';
    runTypewriter('[ enter your name ]', lockPrompt, () => lockInput.focus());
  }

  function runTypewriter(text, el, onDone) {
    let i = 0;
    el.textContent = '';
    const id = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(id); if (onDone) onDone(); }
    }, 80);
  }

  function unlock() {
    sessionStorage.setItem('unlocked', '1');
    lockScreen.classList.add('lock--out');
    page.classList.add('page--in');
    setTimeout(() => { lockScreen.style.display = 'none'; }, 650);
  }

  function denyAccess() {
    lockHint.textContent = '[ access denied ]';
    lockHint.style.opacity = '1';
    inputRow.classList.add('shake');
    inputRow.addEventListener('animationend', () => {
      inputRow.classList.remove('shake');
      inputRow.style.borderColor = '';
      inputRow.style.boxShadow = '';
    }, { once: true });
    lockInput.value = '';
    setTimeout(() => { lockHint.style.opacity = '0'; }, 1600);
  }

  lockInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const val = lockInput.value.trim().toLowerCase();
    if (VALID.includes(val)) unlock();
    else denyAccess();
  });
})();

/* ── Starfield ── */
(function () {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        size:  Math.random() < 0.6 ? 1 : 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.008
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.phase += s.speed;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(120); });
  resize();
  createStars(120);
  requestAnimationFrame(draw);
})();

/* ── Tile click → popup ── */
const overlay    = document.getElementById('popupOverlay');
const popupIcon  = document.getElementById('popupIcon');
const popupTitle = document.getElementById('popupTitle');
const popupSub   = document.getElementById('popupSub');
const closeBtn   = document.getElementById('popupClose');

const tileData = {
  camera:   { icon: '📷', title: 'PHOTOS',  sub: 'our pictures & memories\nare coming here soon ♡' },
  envelope: { icon: '✉️',  title: 'LETTERS', sub: 'love letters written\njust for you ♡' },
  disk:     { icon: '💿', title: 'MUSIC',   sub: 'playlists\nare coming here soon ♡' },
  mystery:  { icon: '🎁', title: '???',     sub: 'coming soon! ♡' }
};

const tileColors = {
  camera: '#ff6b9d', envelope: '#ffd93d', disk: '#6bcfff', mystery: '#c77dff'
};

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const key   = tile.dataset.tile;
    const data  = tileData[key];
    const color = tileColors[key] || '#fff';
    if (!data) return;

    popupIcon.textContent  = data.icon;
    popupTitle.textContent = data.title;
    popupSub.innerHTML     = data.sub.replace(/\n/g, '<br>');

    const popup = document.querySelector('.popup');
    popup.style.borderColor   = color;
    popup.style.boxShadow     = `8px 8px 0 0 ${color}55`;
    popupTitle.style.color    = color;

    overlay.classList.add('open');
  });
});

function closePopup() { overlay.classList.remove('open'); }

closeBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
