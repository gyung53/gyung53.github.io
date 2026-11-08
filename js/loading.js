/* ==========================================================================
   loading.js — 일정 시간 후 자동으로 main.html 로 이동, 클릭하면 즉시 이동
   ========================================================================== */

(function () {
  'use strict';

  const REDIRECT_DELAY = 2200; // ms
  let redirected = false;

  function goToMain() {
    if (redirected) return;
    redirected = true;
    window.location.href = 'main.html';
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(goToMain, REDIRECT_DELAY);
    document.body.addEventListener('click', goToMain);
  });
})();
