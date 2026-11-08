/* ==========================================================================
   compare.js — 비교 모드
   - 상세 페이지 왼쪽 위 '비교하기' 버튼 → 지금 보고 있는 단어가 A(왼쪽)로 고정
   - 이후 하단 선택지 / 사이드바에서 고르는 단어가 B(오른쪽)에 표시
   - 가운데에 두 단어의 자모 차이(예: ㅂ → ㅃ 자음)를 보여줌
   - ⇄ 버튼으로 A·B 교체, '비교 끝내기'로 원래 화면 복귀
   - 기존 detail.js 수정 없이 sorigyeol:wordchange 이벤트만 사용
   ========================================================================== */

(function () {
  'use strict';

  const TYPE_NAME = { cho: '자음', jung: '모음', jong: '받침' };

  function diffWords(a, b) {
    const dec = window.SorigyeolPad && window.SorigyeolPad.decompose;
    if (!dec) return null;
    const da = dec(a);
    const db = dec(b);
    const ka = Object.keys(da);
    const kb = Object.keys(db);
    if (ka.length !== kb.length) return null;          // 글자 수가 다르면 다른 계열
    const out = [];
    const seen = new Set();
    ka.forEach((k) => {
      if (!db[k] || da[k].val === db[k].val) return;
      const key = da[k].type + da[k].val + db[k].val;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ type: da[k].type, from: da[k].val || '—', to: db[k].val || '—' });
    });
    return out.length && out.length <= 3 ? out : null;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.detail-main');
    const sidebar = document.querySelector('.detail-sidebar');
    const meaningText = document.querySelector('.detail-meaning__text');
    if (!main || !sidebar) return;

    let comparing = false;
    let current = null;   // 가장 최근에 선택된 단어 정보
    let A = null;
    let B = null;

    /* ---- 요소 ---- */
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'compare-toggle';
    toggle.id = 'compare-toggle';
    toggle.innerHTML = `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="2.5" y="4" width="6.5" height="12" rx="1.5"/>
        <rect x="11" y="4" width="6.5" height="12" rx="1.5"/>
      </svg>
      <span class="compare-toggle__text">비교하기</span>`;
    main.appendChild(toggle);

    const stage = document.createElement('section');
    stage.className = 'compare-stage';
    stage.id = 'compare-stage';
    stage.setAttribute('aria-label', '두 단어 비교');
    stage.innerHTML = `
      <div class="compare-panel" data-slot="A"></div>
      <div class="compare-middle">
        <div class="compare-diff"></div>
        <button type="button" class="compare-swap" aria-label="A와 B 바꾸기" title="A와 B 바꾸기">⇄</button>
      </div>
      <div class="compare-panel" data-slot="B"></div>`;
    main.appendChild(stage);

    const panelA = stage.querySelector('[data-slot="A"]');
    const panelB = stage.querySelector('[data-slot="B"]');
    const diffEl = stage.querySelector('.compare-diff');

    function infoFor(word) {
      const chip = sidebar.querySelector(`.word-chip[data-word="${word}"]`);
      return {
        word,
        path: chip ? chip.dataset.path : '',
        meaning: meaningText ? meaningText.textContent : ''
      };
    }

    function renderPanel(el, info, slot) {
      if (!info) {
        el.classList.add('is-empty');
        el.innerHTML = `
          <span class="compare-panel__slot">${slot}</span>
          <div class="compare-panel__placeholder">
            <p>비교할 단어를 골라 보세요</p>
            <span>아래 계열어 목록이나 왼쪽 사이드바에서 선택</span>
          </div>`;
        return;
      }
      el.classList.remove('is-empty');
      el.innerHTML = `
        <span class="compare-panel__slot">${slot}</span>
        <div class="compare-panel__media">
          <img alt="${escapeHtml(info.word)}">
        </div>
        <p class="compare-panel__word">${escapeHtml(info.word)}</p>
        <p class="compare-panel__meaning">${escapeHtml(info.meaning)}</p>`;
      const img = el.querySelector('img');
      const candidates = info.path ? [`/${info.path}`, info.path] : [];
      let i = 0;
      const next = () => {
        if (i >= candidates.length) { img.remove(); return; }
        img.src = candidates[i++];
      };
      img.onerror = next;
      next();
    }

    function renderDiff() {
      if (!A || !B) { diffEl.innerHTML = ''; return; }
      const diffs = diffWords(A.word, B.word);
      diffEl.innerHTML = diffs
        ? diffs.map((d) => `
            <div class="compare-diff__row">
              <span class="compare-diff__jamo">${d.from}<em>→</em>${d.to}</span>
              <span class="compare-diff__type">${TYPE_NAME[d.type]}</span>
            </div>`).join('')
        : '<div class="compare-diff__row"><span class="compare-diff__type">다른 계열</span></div>';
    }

    function render() {
      renderPanel(panelA, A, 'A');
      renderPanel(panelB, B, 'B');
      renderDiff();
      stage.classList.toggle('has-both', !!(A && B));
    }

    function setComparing(on) {
      comparing = on;
      document.body.classList.toggle('is-comparing', on);
      toggle.classList.toggle('is-on', on);
      toggle.querySelector('.compare-toggle__text').textContent = on ? '비교 끝내기' : '비교하기';
      if (on) {
        A = current;
        B = null;
        render();
      }
    }

    toggle.addEventListener('click', () => setComparing(!comparing));

    stage.querySelector('.compare-swap').addEventListener('click', () => {
      if (!A || !B) return;
      [A, B] = [B, A];
      render();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && comparing) setComparing(false);
    });

    window.addEventListener('sorigyeol:wordchange', (e) => {
      const word = e.detail && e.detail.word;
      if (!word) return;
      current = infoFor(word);
      if (!comparing) return;
      if (!A) { A = current; render(); return; }
      if (word === A.word) return;
      B = current;
      render();
    });

    // ?word= 로 진입해서 이미 선택된 단어가 있는 경우
    const activeChip = sidebar.querySelector('.word-chip.is-active');
    if (activeChip) current = infoFor(activeChip.dataset.word);
  });
})();
