/* ==========================================================================
   gyeol-stats.js — 관람객 기록 (전시용 맥 브라우저에 저장, 인터넷 불필요)
   - 상세 페이지: 단어를 1.5초 이상 보고 있으면 1회로 기록
     (결 패드를 빠르게 드래그하며 지나친 단어는 세지 않음)
   - 기록은 localStorage 'sorigyeol-stats-v1' 에 날짜별·전체로 저장
   - 랭킹 페이지(pages/ranking.html)가 window.SorigyeolStats 로 읽어감
   ========================================================================== */

(function () {
  'use strict';

  const KEY = 'sorigyeol-stats-v1';
  const DWELL_MS = 1500;

  function today() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (data && data.total && data.days && data.meta) return data;
    } catch (e) { /* 저장소 사용 불가 시 빈 기록 */ }
    return { total: {}, days: {}, meta: {} };
  }

  function save(data) {
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* 무시 */ }
  }

  function record(word, meta) {
    const data = load();
    const day = today();
    data.total[word] = (data.total[word] || 0) + 1;
    data.days[day] = data.days[day] || {};
    data.days[day][word] = (data.days[day][word] || 0) + 1;
    data.meta[word] = Object.assign({}, data.meta[word], meta);
    save(data);
  }

  // scope: 'today' | 'all'
  function ranking(scope, limit) {
    const data = load();
    const counts = scope === 'today' ? (data.days[today()] || {}) : data.total;
    const list = Object.keys(counts)
      .map((w) => Object.assign({ word: w, count: counts[w] }, data.meta[w]))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word, 'ko'));
    const sum = list.reduce((s, r) => s + r.count, 0);
    return { list: limit ? list.slice(0, limit) : list, sum };
  }

  function reset() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* 무시 */ }
  }

  window.SorigyeolStats = { record, ranking, reset, today, KEY };

  /* ---- 상세 페이지에서 자동 기록 ---- */
  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.detail-sidebar');
    if (!sidebar) return;

    const titleEl = sidebar.querySelector('.detail-sidebar__title');
    const categoryName = titleEl ? titleEl.textContent.trim() : '';
    let timer = null;

    function schedule(word) {
      if (timer) clearTimeout(timer);
      if (!word) return;
      timer = setTimeout(() => {
        const chip = sidebar.querySelector(`.word-chip[data-word="${word}"]`);
        record(word, {
          page: window.location.pathname,
          path: chip ? chip.dataset.path : '',
          category: categoryName
        });
      }, DWELL_MS);
    }

    window.addEventListener('sorigyeol:wordchange', (e) => schedule(e.detail && e.detail.word));

    const activeChip = sidebar.querySelector('.word-chip.is-active');
    if (activeChip) schedule(activeChip.dataset.word);
  });
})();
