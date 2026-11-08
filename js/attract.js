/* ==========================================================================
   attract.js — 대기 화면 (아무도 사용하지 않을 때 GIF 자동 재생)
   - IDLE_SECONDS 동안 아무 입력이 없으면 전체 화면으로 계열어 GIF가 차례로 흐름
   - 같은 계열 단어를 순서대로 이어 보여줘서 '결'의 차이가 드러나도록 함
     (계열 순서는 매번 섞임)
   - 화면을 누르거나, 키를 누르거나, 마우스를 크게 움직이면 종료
     → 상세/랭킹 페이지였다면 메인으로 돌아가 다음 관람객을 맞음
   - GIF 파일이 아직 없는 단어는 자동으로 건너뜀
   ========================================================================== */

(function () {
  'use strict';

  const IDLE_SECONDS = 45;     // 대기 화면이 뜨기까지 기다리는 시간(초)
  const SLIDE_SECONDS = 3.5;   // 단어 하나를 보여주는 시간(초)
  const MAIN_URL = '/main.html';

  let idleTimer = null;
  let slideTimer = null;
  let active = false;
  let closing = false;
  let queue = [];
  let qIndex = 0;
  let layerIndex = 0;
  let lastMouse = null;

  /* ---------------- 재생 목록: 계열별로 묶고, 계열 순서만 섞기 ---------------- */
  function buildQueue() {
    const words = window.SORIGYEOL_WORDS || [];
    const groups = [];
    const byGroup = {};
    words.forEach((w) => {
      const key = w.category + '|' + w.group;
      if (!byGroup[key]) { byGroup[key] = []; groups.push(byGroup[key]); }
      byGroup[key].push(w);
    });
    for (let i = groups.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groups[i], groups[j]] = [groups[j], groups[i]];
    }
    return groups.flat();
  }

  /* ---------------- 화면 ---------------- */
  let overlay;
  let layers;
  let wordEl;
  let metaEl;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'attract';
    overlay.id = 'attract';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="attract__brand">소리결</div>
      <div class="attract__stage">
        <img class="attract__gif" alt="">
        <img class="attract__gif" alt="">
      </div>
      <div class="attract__caption">
        <p class="attract__word"></p>
        <p class="attract__meta"></p>
      </div>
      <p class="attract__hint"><span class="attract__dot"></span>화면을 누르거나 아무 키나 눌러 시작하세요</p>`;
    document.body.appendChild(overlay);
    layers = Array.from(overlay.querySelectorAll('.attract__gif'));
    wordEl = overlay.querySelector('.attract__word');
    metaEl = overlay.querySelector('.attract__meta');
  }

  // 다음 단어 표시 (GIF 로드에 실패하면 다음 단어로 건너뜀)
  function showNext(skips) {
    if (!active) return;
    skips = skips || 0;
    if (skips > queue.length) return;              // 보여줄 GIF가 하나도 없음
    if (qIndex >= queue.length) { queue = buildQueue(); qIndex = 0; }
    const item = queue[qIndex++];

    const img = new Image();
    img.onload = () => {
      if (!active) return;
      layerIndex = 1 - layerIndex;
      const front = layers[layerIndex];
      const back = layers[1 - layerIndex];
      front.src = img.src;
      front.alt = item.word;
      front.classList.add('is-on');
      back.classList.remove('is-on');
      wordEl.textContent = item.word;
      metaEl.textContent = `${item.categoryName} · ${item.group}`;
      overlay.classList.remove('is-text-in');
      void overlay.offsetWidth;                    // 글자 등장 애니메이션 재시작
      overlay.classList.add('is-text-in');
      slideTimer = setTimeout(() => showNext(0), SLIDE_SECONDS * 1000);
    };
    img.onerror = () => showNext(skips + 1);
    img.src = '/' + item.path;
  }

  function start() {
    if (active || document.hidden) return;
    // 음성 인식 중이거나 검색창에 입력 중이면 미룸
    const typing = document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.value;
    if (document.querySelector('.gnb--listening') || typing) { resetIdle(); return; }
    if (!overlay) createOverlay();
    active = true;
    closing = false;
    queue = buildQueue();
    qIndex = 0;
    lastMouse = null;
    overlay.classList.add('is-show');
    showNext(0);
  }

  function stop() {
    if (!active || closing) return;
    closing = true;
    clearTimeout(slideTimer);
    const onMain = /\/main\.html$/.test(window.location.pathname) || window.location.pathname === '/';
    if (!onMain) {
      window.location.href = MAIN_URL;              // 다음 관람객을 위해 메인으로
      return;
    }
    overlay.classList.remove('is-show');
    // 사라지는 동안(0.4초)은 대기 화면이 클릭을 받아서 아래 링크가 눌리지 않음
    setTimeout(() => {
      active = false;
      closing = false;
      layers.forEach((l) => { l.classList.remove('is-on'); l.removeAttribute('src'); });
      resetIdle();
    }, 400);
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(start, IDLE_SECONDS * 1000);
  }

  /* ---------------- 입력 감지 ---------------- */
  function onActivity(e) {
    if (active) {
      // 대기 화면을 끄는 입력은 아래 화면에 전달하지 않음 (스페이스 → 음성 인식 등 방지)
      e.preventDefault();
      e.stopImmediatePropagation();
      stop();
      return;
    }
    resetIdle();
  }

  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((type) => {
    window.addEventListener(type, onActivity, { capture: true, passive: false });
  });

  // 대기 화면이 떠 있는 동안 키를 뗀 신호도 막음
  window.addEventListener('keyup', (e) => {
    if (active) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // 마우스 이동: 평소엔 대기 시간 초기화, 대기 화면에서는 크게 움직였을 때만 종료
  window.addEventListener('mousemove', (e) => {
    if (!active) { resetIdle(); return; }
    if (!lastMouse) { lastMouse = { x: e.clientX, y: e.clientY }; return; }
    if (Math.abs(e.clientX - lastMouse.x) + Math.abs(e.clientY - lastMouse.y) > 40) stop();
  }, true);

  window.addEventListener('click', (e) => {
    if (active) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  document.addEventListener('visibilitychange', () => { if (!document.hidden) resetIdle(); });

  document.addEventListener('DOMContentLoaded', resetIdle);

  // 테스트용: 콘솔에서 SorigyeolAttract.start() 로 바로 확인
  window.SorigyeolAttract = { start, stop };
})();
