/* ==========================================================================
   main.js — 메인 페이지 전용 스크립트
   1) 로고 이미지가 없을 때 텍스트 로고로 대체 표시
   2) 도형 ↔ GNB 메뉴 상호 호버 연동 (짝: data-key)
      - 도형에 호버 → 해당 GNB 메뉴 강조
      - GNB 메뉴에 호버 → 해당 도형이 변형 애니메이션 재생
      - 어느 한쪽이라도 호버 중이면, 짝이 아닌 나머지 도형은 #DDDDDD로 가라앉음
   ========================================================================== */

(function () {
  'use strict';

  function initLogoFallback() {
    const logoImg = document.querySelector('.hero__logo img');
    const fallback = document.querySelector('.hero__logo-fallback');
    if (!logoImg || !fallback) return;

    logoImg.addEventListener('load', () => {
      logoImg.style.display = 'block';
      fallback.style.display = 'none';
    });
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
      fallback.style.display = 'block';
    });
  }

  function initShapeNavPairing() {
    const hero = document.querySelector('.hero');
    const nav = document.querySelector('.gnb__nav');
    const shapes = Array.from(document.querySelectorAll('.shape[data-key]'));
    const navLinks = Array.from(document.querySelectorAll('.gnb__link[data-key]'));
    if (!hero || !shapes.length) return;

    function setActive(key) {
      hero.classList.add('is-pairing');
      if (nav) nav.classList.add('is-pairing');
      shapes.forEach((s) => s.classList.toggle('is-active', s.dataset.key === key));
      navLinks.forEach((l) => l.classList.toggle('is-paired', l.dataset.key === key));
    }

    function clearActive() {
      hero.classList.remove('is-pairing');
      if (nav) nav.classList.remove('is-pairing');
      shapes.forEach((s) => s.classList.remove('is-active'));
      navLinks.forEach((l) => l.classList.remove('is-paired'));
    }

    shapes.forEach((shape) => {
      const key = shape.dataset.key;
      shape.addEventListener('mouseenter', () => setActive(key));
      shape.addEventListener('mouseleave', clearActive);
      shape.addEventListener('focus', () => setActive(key));
      shape.addEventListener('blur', clearActive);
    });

    navLinks.forEach((link) => {
      const key = link.dataset.key;
      link.addEventListener('mouseenter', () => setActive(key));
      link.addEventListener('mouseleave', clearActive);
      link.addEventListener('focus', () => setActive(key));
      link.addEventListener('blur', clearActive);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLogoFallback();
    initShapeNavPairing();
  });
})();
