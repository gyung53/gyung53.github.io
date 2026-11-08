/* ==========================================================================
   common.js — 모든 페이지가 공유하는 스크립트
   1) fitPage()      : .page 를 뷰포트 크기에 맞춰 scale → 가로/세로 스크롤 완전 차단
   2) GNB 검색 토글   : 검색 아이콘 클릭 → 검색창 펼침/접힘
   3) 현재 메뉴 표시   : 현재 페이지에 해당하는 GNB 메뉴에 is-current 클래스
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1) 뷰포트에 맞춰 캔버스 크기 조정 (스크롤 방지)
     상세 페이지(.page--detail)는 100vh 전폭 레이아웃을 사용하여 상하 여백을 완전 제거합니다.
     ------------------------------------------------------------------ */
  function fitPage() {
    const page = document.querySelector('.page');
    if (!page) return;

    if (page.classList.contains('page--detail')) {
      page.style.transform = 'none';
      page.classList.add('is-ready');
      return;
    }

    page.style.transform = 'none';               // 실제(원본) 크기를 측정하기 위해 초기화
    const rect = page.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scale = Math.min(
      window.innerWidth / rect.width,
      window.innerHeight / rect.height
    );

    page.style.transform = `scale(${scale})`;
    page.classList.add('is-ready');
  }

  let resizeTimer = null;
  function scheduleFit() {
    if (resizeTimer) window.cancelAnimationFrame(resizeTimer);
    resizeTimer = window.requestAnimationFrame(fitPage);
  }

  /* ------------------------------------------------------------------
     2) GNB 검색 토글 & 일체형 캡슐 인터랙션 및 계열어 검색 네비게이션
     ------------------------------------------------------------------ */
  function initGnbSearch() {
    const gnb = document.querySelector('.gnb');
    if (!gnb) return;

    const btn = gnb.querySelector('.gnb__search-btn');
    const input = gnb.querySelector('.gnb__search-input');
    const pill = gnb.querySelector('.gnb__search-pill');
    const gnbRight = gnb.querySelector('.gnb__right');
    if (!btn || !input) return;

    // 추천 검색어 드롭다운 요소 생성
    let dropdown = gnb.querySelector('.gnb__search-dropdown');
    if (!dropdown && gnbRight) {
      dropdown = document.createElement('div');
      dropdown.className = 'gnb__search-dropdown';
      dropdown.id = 'gnb-search-dropdown';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', '검색 추천 결과');
      gnbRight.appendChild(dropdown);
    }

    // 피드백 토스트 요소 생성
    let toast = gnb.querySelector('.gnb__search-toast');
    if (!toast && gnbRight) {
      toast = document.createElement('div');
      toast.className = 'gnb__search-toast';
      toast.id = 'gnb-search-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      gnbRight.appendChild(toast);
    }

    let toastTimer = null;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-show');
      }, 2500);
    }

    let focusedItemIndex = -1;

    function openSearch() {
      if (gnb.classList.contains('gnb--active')) return;
      gnb.classList.add('gnb--active');
      window.setTimeout(() => input.focus(), 250);
      scheduleFit();
    }

    function closeSearch() {
      if (!gnb.classList.contains('gnb--active')) return;
      gnb.classList.remove('gnb--active');
      input.value = '';
      input.blur();
      closeDropdown();
      scheduleFit();
    }

    function closeDropdown() {
      if (dropdown) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
      }
      focusedItemIndex = -1;
    }

    /**
     * 계열어 검색 실행 후 해당 상세 페이지로 이동 또는 단어 활성화
     */
    function executeSearch(query) {
      if (!query || !query.trim()) return;
      const cleanQ = query.trim();

      const searchFn = window.searchSorigyeolWord;
      const matched = typeof searchFn === 'function' ? searchFn(cleanQ) : null;

      if (matched) {
        closeDropdown();
        // 현재 페이지가 이미 대상 상세 페이지인 경우
        const currentPath = window.location.pathname;
        const isCurrentPage = currentPath.endsWith(matched.page) || currentPath === matched.page;

        if (isCurrentPage && window.SorigyeolDetail && typeof window.SorigyeolDetail.selectWord === 'function') {
          // 동일 페이지 내 즉시 활성화
          window.SorigyeolDetail.selectWord(matched.word);
          // 브라우저 URL 갱신 (히스토리 보존)
          const newUrl = `${matched.page}?word=${encodeURIComponent(matched.word)}`;
          window.history.replaceState({ word: matched.word }, '', newUrl);
          input.value = matched.word;
          return;
        }

        // 다른 페이지로 이동 (쿼리스트링 word 포함)
        const targetUrl = `${matched.page}?word=${encodeURIComponent(matched.word)}`;
        window.location.href = targetUrl;
      } else {
        showToast(`'${cleanQ}'에 일치하는 계열어를 찾을 수 없습니다`);
      }
    }

    /**
     * 실시간 검색어 입력에 따른 추천 드롭다운 렌더링
     */
    function updateSuggestions() {
      const query = input.value.trim();
      if (!query || !dropdown) {
        closeDropdown();
        return;
      }

      const filterFn = window.filterSorigyeolWords;
      const results = typeof filterFn === 'function' ? filterFn(query, 6) : [];

      if (!results.length) {
        dropdown.innerHTML = `
          <div class="gnb__search-empty">
            '${escapeHtml(query)}' 검색 결과가 없습니다.<br>
            <span style="font-size: 11px; color: #999; margin-top: 4px; display: inline-block;">(예: 쫑알쫑알, 반짝반짝, 바글바글 등)</span>
          </div>
        `;
        dropdown.classList.add('is-open');
        focusedItemIndex = -1;
        return;
      }

      dropdown.innerHTML = results.map((item, idx) => `
        <button type="button" class="gnb__search-item" data-index="${idx}" data-word="${escapeHtml(item.word)}" data-page="${escapeHtml(item.page)}" role="option">
          <div class="gnb__search-item-left">
            <span class="gnb__search-item-word">${highlightMatch(item.word, query)}</span>
            <span class="gnb__search-item-group">${escapeHtml(item.group)}</span>
          </div>
          <span class="gnb__search-item-badge">${escapeHtml(item.categoryName)}</span>
        </button>
      `).join('');

      dropdown.classList.add('is-open');
      focusedItemIndex = -1;

      // 추천 아이템 클릭 이벤트
      dropdown.querySelectorAll('.gnb__search-item').forEach((itemBtn) => {
        itemBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const word = itemBtn.dataset.word;
          executeSearch(word);
        });
      });
    }

    function highlightMatch(text, q) {
      if (!q) return escapeHtml(text);
      const idx = text.indexOf(q);
      if (idx === -1) return escapeHtml(text);
      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + q.length);
      const after = text.substring(idx + q.length);
      return `${escapeHtml(before)}<strong style="font-weight:700; color:var(--color-black);">${escapeHtml(match)}</strong>${escapeHtml(after)}`;
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m]));
    }

    btn.addEventListener('click', (e) => {
      const isActive = gnb.classList.contains('gnb--active');
      if (!isActive) {
        e.stopPropagation();
        openSearch();
      } else {
        if (input.value.trim()) {
          executeSearch(input.value.trim());
        } else {
          closeSearch();
        }
      }
    });

    if (pill) {
      pill.addEventListener('click', (e) => {
        if (!gnb.classList.contains('gnb--active')) {
          openSearch();
        }
      });
      pill.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim()) {
          executeSearch(input.value.trim());
        }
      });
    }

    input.addEventListener('input', () => {
      updateSuggestions();
    });

    input.addEventListener('keydown', (e) => {
      const items = dropdown ? Array.from(dropdown.querySelectorAll('.gnb__search-item')) : [];

      if (e.key === 'ArrowDown') {
        if (items.length) {
          e.preventDefault();
          focusedItemIndex = (focusedItemIndex + 1) % items.length;
          items.forEach((it, idx) => it.classList.toggle('is-focused', idx === focusedItemIndex));
          items[focusedItemIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        if (items.length) {
          e.preventDefault();
          focusedItemIndex = (focusedItemIndex - 1 + items.length) % items.length;
          items.forEach((it, idx) => it.classList.toggle('is-focused', idx === focusedItemIndex));
          items[focusedItemIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedItemIndex >= 0 && items[focusedItemIndex]) {
          const word = items[focusedItemIndex].dataset.word;
          executeSearch(word);
        } else if (input.value.trim()) {
          executeSearch(input.value.trim());
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });

    document.addEventListener('click', (e) => {
      if (!gnb.contains(e.target)) {
        closeSearch();
      }
    });

    // 음성 검색(voice.js) 등 외부 스크립트에서 검색 기능을 재사용할 수 있도록 노출
    window.SorigyeolSearch = {
      open: openSearch,
      close: closeSearch,
      execute: executeSearch,
      updateSuggestions: updateSuggestions,
      showToast: showToast,
      input: input,
      gnb: gnb
    };
  }

  /* ------------------------------------------------------------------
     3) 현재 메뉴 표시
     ------------------------------------------------------------------ */
  function markCurrentNav() {
    const currentPage = document.body.dataset.page;
    if (!currentPage) return;
    document
      .querySelectorAll(`.gnb__link[data-page="${currentPage}"]`)
      .forEach((link) => link.classList.add('is-current'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGnbSearch();
    markCurrentNav();
    fitPage();
  });

  window.addEventListener('resize', scheduleFit);
  window.addEventListener('load', scheduleFit);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }

  window.SorigyeolFit = { fitPage: scheduleFit };
})();
