/* ==========================================================================
   gyeol-pad.js — 결 조절 패드
   - 상세 페이지에서 단어가 선택되면 왼쪽 위에 '결 패드'가 나타남
   - 같은 계열 단어들을 자모 단위로 비교해서 무엇이 달라지는지(자음/모음/받침)
     자동으로 찾아내고, 그 차이를 가로·세로 축으로 배치
       예) 바글 계열 → 가로: 모음(ㅏ ㅗ ㅜ) × 세로: 자음(ㅂ ㅃ)
           깔깔 계열 → 가로: 모음(ㅏ ㅣ ㅓ) 1줄 슬라이더
   - 점을 드래그하거나 방향키로 움직이면 단어·뜻·GIF가 실시간으로 바뀜
   - 기존 detail.js 의 selectWord / sorigyeol:wordchange 이벤트만 사용 (기존 코드 수정 없음)
   ========================================================================== */

(function () {
  'use strict';

  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
  const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  // 자음 세기 순서: 예사소리 < 거센소리 < 된소리
  const CHO_RANK = {
    'ㄱ': 0, 'ㄷ': 0, 'ㅂ': 0, 'ㅅ': 0, 'ㅈ': 0,
    'ㅋ': 1, 'ㅌ': 1, 'ㅍ': 1, 'ㅊ': 1,
    'ㄲ': 2, 'ㄸ': 2, 'ㅃ': 2, 'ㅆ': 2, 'ㅉ': 2
  };

  const AXIS_NAME = { cho: '자음', jung: '모음', jong: '받침', order: '결' };

  /* ---------------- 1) 계열 분석: 무엇이 달라지는가 ---------------- */
  function decompose(word) {
    const slots = {};
    Array.from(word).forEach((ch, i) => {
      const code = ch.charCodeAt(0) - 0xAC00;
      if (code < 0 || code >= 11172) return;
      slots[i + 'a'] = { type: 'cho', val: CHO[Math.floor(code / 588)] };
      slots[i + 'b'] = { type: 'jung', val: JUNG[Math.floor((code % 588) / 28)] };
      slots[i + 'c'] = { type: 'jong', val: JONG[code % 28] };
    });
    return slots;
  }

  function buildModel(words) {
    if (words.length < 2) return null;
    const decomposed = words.map(decompose);
    const keys = Object.keys(decomposed[0]).filter((k) => decomposed.every((d) => d[k]));

    // 단어마다 값이 달라지는 자리(slot)만 축 후보로. 같은 방식으로 갈리는 자리는 하나로 합침
    const axes = [];
    const seen = new Set();
    keys.forEach((k) => {
      const vals = decomposed.map((d) => d[k].val);
      const distinct = [...new Set(vals)];
      if (distinct.length < 2) return;
      const signature = vals.map((v) => distinct.indexOf(v)).join(',');
      if (seen.has(signature)) return;
      seen.add(signature);
      const type = decomposed[0][k].type;
      let order = distinct.slice();
      if (type === 'cho') {
        order.sort((a, b) => (CHO_RANK[a] ?? 9) - (CHO_RANK[b] ?? 9) || distinct.indexOf(a) - distinct.indexOf(b));
      }
      axes.push({ type, vals, order });
    });

    let x = axes.find((a) => a.type === 'jung') || axes[0];
    let y = axes.find((a) => a !== x && a.type === 'cho') || axes.find((a) => a !== x) || null;

    const orderAxis = () => ({ type: 'order', vals: words.slice(), order: words.slice() });
    if (!x) x = orderAxis();

    // 2축인데 (x,y) 조합이 겹치면 → 1줄 순서 슬라이더로
    if (y) {
      const combos = new Set(words.map((_, i) => x.vals[i] + '|' + y.vals[i]));
      if (combos.size !== words.length) { x = orderAxis(); y = null; }
    } else {
      const uniq = new Set(x.vals);
      if (uniq.size !== words.length) x = orderAxis();
    }

    const cells = words.map((w, i) => ({
      word: w,
      col: x.order.indexOf(x.vals[i]),
      row: y ? y.order.indexOf(y.vals[i]) : 0
    }));

    return { words, x, y, cols: x.order.length, rows: y ? y.order.length : 1, cells };
  }

  /* ---------------- 2) 화면 ----------------
     PAD_ENABLED = false → 패드를 화면에 띄우지 않음 (보류 중)
     다시 쓰려면 true 로만 바꾸면 됩니다. 자모 분석(decompose)은 비교 모드가 계속 사용합니다. */
  const PAD_ENABLED = false;

  document.addEventListener('DOMContentLoaded', () => {
    if (!PAD_ENABLED) return;
    const main = document.querySelector('.detail-main');
    const sidebar = document.querySelector('.detail-sidebar');
    if (!main || !sidebar) return;

    const pad = document.createElement('section');
    pad.className = 'gyeol-pad';
    pad.id = 'gyeol-pad';
    pad.setAttribute('aria-label', '결 조절 패드');
    pad.innerHTML = `
      <header class="gyeol-pad__head">
        <span class="gyeol-pad__title">결 패드</span>
        <span class="gyeol-pad__hint">점을 끌어 결을 바꿔 보세요</span>
      </header>
      <div class="gyeol-pad__body">
        <div class="gyeol-pad__yaxis"></div>
        <div class="gyeol-pad__field" tabindex="0" role="slider" aria-label="결 조절">
          <div class="gyeol-pad__grid"></div>
          <div class="gyeol-pad__knob"></div>
        </div>
        <div class="gyeol-pad__xaxis"></div>
      </div>`;
    main.appendChild(pad);

    const field = pad.querySelector('.gyeol-pad__field');
    const grid = pad.querySelector('.gyeol-pad__grid');
    const knob = pad.querySelector('.gyeol-pad__knob');
    const xAxisEl = pad.querySelector('.gyeol-pad__xaxis');
    const yAxisEl = pad.querySelector('.gyeol-pad__yaxis');

    const COL_W = 74;   // 칸 가로 간격
    const ROW_H = 54;   // 칸 세로 간격
    const INSET = 28;   // 필드 안쪽 여백
    const LABEL_SPACE = 14; // 맨 아래 줄 단어 라벨 자리

    let model = null;
    let groupEl = null;
    let activeCell = null;
    let dragging = false;

    function cellPos(col, row) {
      return {
        x: INSET + col * COL_W,
        y: INSET + (model.rows - 1 - row) * ROW_H   // row 0(약한 쪽)이 아래
      };
    }

    function render() {
      const w = INSET * 2 + (model.cols - 1) * COL_W;
      const h = INSET * 2 + (model.rows - 1) * ROW_H + LABEL_SPACE;
      field.style.width = w + 'px';
      field.style.height = h + 'px';
      pad.classList.toggle('is-1d', model.rows === 1);

      // 격자선
      let lines = '';
      if (model.rows === 1) {
        lines += `<line x1="${INSET}" y1="${INSET}" x2="${w - INSET}" y2="${INSET}"/>`;
      } else {
        for (let c = 0; c < model.cols; c++) {
          const x = INSET + c * COL_W;
          lines += `<line x1="${x}" y1="${INSET}" x2="${x}" y2="${h - INSET - LABEL_SPACE}"/>`;
        }
        for (let r = 0; r < model.rows; r++) {
          const y = INSET + r * ROW_H;
          lines += `<line x1="${INSET}" y1="${y}" x2="${w - INSET}" y2="${y}"/>`;
        }
      }
      grid.innerHTML = `<svg width="${w}" height="${h}" aria-hidden="true">${lines}</svg>` +
        model.cells.map((c) => {
          const p = cellPos(c.col, c.row);
          return `<button type="button" class="gyeol-pad__cell" data-word="${c.word}" style="left:${p.x}px;top:${p.y}px" tabindex="-1">
                    <span class="gyeol-pad__dot"></span><span class="gyeol-pad__label">${c.word}</span>
                  </button>`;
        }).join('');

      // 가로축 눈금
      const tick = (v) => (v === '' ? '—' : v);
      xAxisEl.style.width = w + 'px';
      xAxisEl.innerHTML = model.x.order.map((v, i) =>
        `<span class="gyeol-pad__tick" style="left:${INSET + i * COL_W}px">${tick(v)}</span>`).join('') +
        `<span class="gyeol-pad__axisname">${AXIS_NAME[model.x.type]}</span>`;
      if (model.x.type === 'order') xAxisEl.innerHTML = '';

      // 세로축 눈금
      yAxisEl.style.height = h + 'px';
      yAxisEl.innerHTML = model.y
        ? model.y.order.map((v, r) =>
            `<span class="gyeol-pad__tick" style="top:${INSET + (model.rows - 1 - r) * ROW_H}px">${tick(v)}</span>`).join('') +
          `<span class="gyeol-pad__axisname">${AXIS_NAME[model.y.type]}</span>`
        : '';
    }

    function placeKnob(x, y, animate) {
      knob.classList.toggle('is-snapping', !!animate);
      knob.style.transform = `translate(${x}px, ${y}px)`;
    }

    function setActive(cell, fromPad) {
      if (!cell) return;
      const changed = activeCell !== cell;
      activeCell = cell;
      pad.querySelectorAll('.gyeol-pad__cell').forEach((b) =>
        b.classList.toggle('is-active', b.dataset.word === cell.word));
      field.setAttribute('aria-valuetext', cell.word);
      if (!dragging) {
        const p = cellPos(cell.col, cell.row);
        placeKnob(p.x, p.y, true);
      }
      if (fromPad && changed && window.SorigyeolDetail) {
        window.SorigyeolDetail.selectWord(cell.word);
      }
    }

    function nearestCell(px, py) {
      let best = null;
      let bestD = Infinity;
      model.cells.forEach((c) => {
        const p = cellPos(c.col, c.row);
        const d = (p.x - px) ** 2 + (p.y - py) ** 2;
        if (d < bestD) { bestD = d; best = c; }
      });
      return best;
    }

    /* ---- 단어가 바뀌면(사이드바 클릭·검색·하단 선택지 등) 패드 동기화 ---- */
    function sync(word) {
      const chip = sidebar.querySelector(`.word-chip[data-word="${word}"]`);
      const g = chip ? chip.closest('.word-group') : null;
      if (!g) { pad.classList.remove('is-ready'); return; }

      if (g !== groupEl) {
        groupEl = g;
        const words = Array.from(g.querySelectorAll('.word-chip')).map((c) => c.dataset.word);
        model = buildModel(words);
        activeCell = null;
        if (!model) { pad.classList.remove('is-ready'); return; }
        render();
      }
      if (!model) return;
      pad.classList.add('is-ready');
      setActive(model.cells.find((c) => c.word === word), false);
    }

    window.addEventListener('sorigyeol:wordchange', (e) => sync(e.detail && e.detail.word));

    // 페이지 진입 시 이미 선택된 단어(?word=…)가 있으면 바로 맞춤
    const initialChip = sidebar.querySelector('.word-chip.is-active');
    if (initialChip) sync(initialChip.dataset.word);

    /* ---- 드래그 ---- */
    function localPoint(ev) {
      const r = field.getBoundingClientRect();
      const scaleX = r.width / field.offsetWidth || 1;
      const scaleY = r.height / field.offsetHeight || 1;
      const w = field.offsetWidth;
      const h = field.offsetHeight - LABEL_SPACE;
      const x = Math.min(w - INSET, Math.max(INSET, (ev.clientX - r.left) / scaleX));
      const y = Math.min(h - INSET, Math.max(INSET, (ev.clientY - r.top) / scaleY));
      return { x, y };
    }

    field.addEventListener('pointerdown', (ev) => {
      if (!model) return;
      ev.preventDefault();
      dragging = true;
      field.setPointerCapture(ev.pointerId);
      pad.classList.add('is-dragging');
      const p = localPoint(ev);
      placeKnob(p.x, p.y, true);
      setActive(nearestCell(p.x, p.y), true);
      field.focus({ preventScroll: true });
    });

    field.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const p = localPoint(ev);
      placeKnob(p.x, p.y, false);
      setActive(nearestCell(p.x, p.y), true);
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      pad.classList.remove('is-dragging');
      if (activeCell) {
        const p = cellPos(activeCell.col, activeCell.row);
        placeKnob(p.x, p.y, true);
      }
    };
    field.addEventListener('pointerup', endDrag);
    field.addEventListener('pointercancel', endDrag);

    /* ---- 방향키 (전시장 키보드 조작용) ---- */
    function move(dc, dr) {
      if (!model || !activeCell) return;
      const target = model.cells.find((c) => c.col === activeCell.col + dc && c.row === activeCell.row + dr);
      if (target) setActive(target, true);
    }

    document.addEventListener('keydown', (e) => {
      if (!pad.classList.contains('is-ready')) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const map = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      move(d[0], d[1]);
    });
  });

  // 콘솔 테스트용
  window.SorigyeolPad = { buildModel, decompose };
})();
