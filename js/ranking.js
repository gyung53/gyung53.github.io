/* ==========================================================================
   ranking.js — '오늘의 결' 랭킹 페이지
   - 오늘 / 전체 탭, TOP 5
   - 다른 탭·창에서 기록이 쌓이면 자동 갱신 (5초마다 + storage 이벤트)
   - 항목 클릭 → 해당 상세 페이지로 이동
   - 기록 초기화: 이 페이지에서 Shift + R (관람객이 누르지 않도록 숨김 단축키)
   ========================================================================== */

(function () {
  'use strict';

  const S = window.SorigyeolStats;
  if (!S) return;

  let scope = 'today';
  const listEl = document.getElementById('rank-list');
  const emptyEl = document.getElementById('rank-empty');
  const titleEl = document.getElementById('rank-title');
  const eyebrowEl = document.getElementById('rank-eyebrow');
  const featureEl = document.getElementById('rank-feature');

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function href(r) {
    return r.page ? `${r.page}?word=${encodeURIComponent(r.word)}` : '#';
  }

  let lastSignature = '';

  function render(force) {
    const { list, sum } = S.ranking(scope, 5);
    const signature = scope + JSON.stringify(list) + sum;
    if (!force && signature === lastSignature) return;
    lastSignature = signature;

    const [y, m, d] = S.today().split('-');
    titleEl.textContent = scope === 'today' ? '오늘의 결' : '전체 결';
    eyebrowEl.textContent = scope === 'today'
      ? `${Number(m)}월 ${Number(d)}일 · 누적 ${sum}회`
      : `전시 기간 전체 · 누적 ${sum}회`;

    emptyEl.classList.toggle('is-show', list.length === 0);

    // 1위 대형 GIF
    const top = list[0];
    featureEl.innerHTML = top && top.path
      ? `<a href="${esc(href(top))}" class="rank__feature-link"><img src="/${esc(top.path)}" alt="${esc(top.word)}"></a>`
      : '';

    const max = list.length ? list[0].count : 1;
    listEl.innerHTML = list.map((r, i) => `
      <li class="rank__item${i === 0 ? ' is-first' : ''}">
        <a class="rank__link" href="${esc(href(r))}">
          <span class="rank__num">${i + 1}</span>
          <span class="rank__thumb">${r.path ? `<img src="/${esc(r.path)}" alt="" loading="lazy">` : ''}</span>
          <span class="rank__text">
            <span class="rank__word">${esc(r.word)}</span>
            <span class="rank__meta">${esc(r.category || '')}</span>
          </span>
          <span class="rank__bar"><span style="width:${Math.max(6, (r.count / max) * 100)}%"></span></span>
          <span class="rank__count">${r.count}<small>회</small></span>
        </a>
      </li>`).join('');
  }

  document.querySelectorAll('.rank__tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      scope = btn.dataset.scope;
      document.querySelectorAll('.rank__tab').forEach((b) => b.classList.toggle('is-active', b === btn));
      render(true);
    });
  });

  // 숨김 초기화 단축키
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'R' || e.key === 'ㄲ')) {
      if (window.confirm('관람객 기록을 모두 지울까요? (되돌릴 수 없음)')) {
        S.reset();
        render(true);
      }
    }
  });

  window.addEventListener('storage', (e) => { if (e.key === S.KEY) render(); });
  setInterval(render, 5000);
  render(true);
})();
