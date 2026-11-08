/* ==========================================================================
   group-note.js — 계열 설명 문구
   - 사이드바 <section class="word-group" data-note="…"> 에 적힌 문구를
     그 계열의 단어가 선택됐을 때 오른쪽 위 '뜻' 아래에 보여줌
   - 다른 계열에도 쓰려면 해당 section 에 data-note="문구" 만 추가하면 됨
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.detail-main');
    const sidebar = document.querySelector('.detail-sidebar');
    if (!main || !sidebar) return;

    const note = document.createElement('p');
    note.className = 'detail-group-note';
    note.id = 'detail-group-note';
    main.appendChild(note);

    function update(word) {
      const chip = word ? sidebar.querySelector(`.word-chip[data-word="${word}"]`) : null;
      const group = chip ? chip.closest('.word-group') : null;
      const text = group ? (group.dataset.note || '') : '';
      note.textContent = text;
      note.classList.toggle('has-note', !!text);
    }

    window.addEventListener('sorigyeol:wordchange', (e) => update(e.detail && e.detail.word));

    const activeChip = sidebar.querySelector('.word-chip.is-active');
    if (activeChip) update(activeChip.dataset.word);
  });
})();
