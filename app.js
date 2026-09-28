const scene = document.getElementById('scene');
const sticker = document.getElementById('sticker');
const stickerButton = sticker.closest('.sticker-button');
const voice = document.getElementById('voice');
const ghosts = document.getElementById('ghosts');
const status = document.getElementById('status');
const intro = document.getElementById('intro');
const copyGroup = document.getElementById('copy-group');
let started = false;
let copyTimeout;

const activeSounds = new Set();

function stopMouth() {
  stickerButton.classList.remove('talking');
  status.textContent = '播放结束';
}

function finishSound(sound) {
  activeSounds.delete(sound);
  if (activeSounds.size === 0) stopMouth();
}

function play() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ghostCount = 1 + Math.floor(Math.random() * 10);
  for (let index = 0; index < ghostCount; index++) {
    const direction = Math.random() < .5 ? -1 : 1;
    const start = Math.round(Math.random() * 360);
    const rotation = Math.round(360 + Math.random() * 180) * direction;
    const size = (width < 600 ? 118 : 220) * (.8 + Math.random() * .4);
    const ghost = document.createElement('img');
    ghost.className = 'ghost';
    ghost.src = './assets/ghost.png';
    ghost.alt = '';
    ghost.style.setProperty('--x', `${Math.round(Math.random() * width)}px`);
    ghost.style.setProperty('--y', `${Math.round(Math.random() * height)}px`);
    ghost.style.setProperty('--size', `${Math.round(size)}px`);
    ghost.style.setProperty('--rotate-start', `${start}deg`);
    ghost.style.setProperty('--rotate-mid', `${Math.round(start + rotation * .36)}deg`);
    ghost.style.setProperty('--rotate-late', `${Math.round(start + rotation * .67)}deg`);
    ghost.style.setProperty('--rotate-end', `${start + rotation}deg`);
    ghost.style.setProperty('--delay', `${index * 65}ms`);
    ghost.style.setProperty('--duration', '2100ms');
    ghost.addEventListener('animationend', () => ghost.remove(), { once: true });
    ghosts.append(ghost);
  }
  status.textContent = '正在播放 wawawawa';
  stickerButton.classList.remove('talking');
  void stickerButton.offsetWidth;
  stickerButton.classList.add('talking');
  const sound = new Audio(voice.src);
  activeSounds.add(sound);
  sound.addEventListener('ended', () => finishSound(sound), { once: true });
  sound.addEventListener('error', () => finishSound(sound), { once: true });
  const result = sound.play();
  if (result && typeof result.catch === 'function') {
    result.catch(() => finishSound(sound));
  }
}

function begin() {
  if (started) return;
  started = true;
  intro.hidden = true;
  scene.hidden = false;
  document.body.classList.add('playing');
  scene.querySelector('.sticker-button').focus({ preventScroll: true });
  play();
}
intro.addEventListener('click', (event) => {
  if (!event.target.closest('.community')) begin();
});
copyGroup.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('590457282');
    copyGroup.textContent = '已复制';
    document.getElementById('copy-status').textContent = '群号 590457282 已复制';
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => { copyGroup.textContent = '复制群号'; }, 1800);
  } catch {
    document.getElementById('copy-status').textContent = '请选中群号 590457282 手动复制';
    copyGroup.textContent = '请长按群号';
  }
});
scene.addEventListener('pointerdown', () => { if (started) play(); });
document.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  if (!started) {
    if (!event.target.closest('.community') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      begin();
    }
    return;
  }
  if (event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') event.preventDefault();
  play();
});
