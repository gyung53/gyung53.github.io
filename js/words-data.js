/* ==========================================================================
   words-data.js — 소리결 전체 계열어 단어 레지스트리 및 검색 유틸리티
   총 7개 카테고리 (상태/느낌, 표정/감정, 빛/색깔, 사물소리, 사람소리, 모양/외형, 자연)
   총 116개 계열어 매핑 데이터
   ========================================================================== */

(function () {
  'use strict';

  const SORIGYEOL_WORDS = [
    // 1. 상태/느낌 (/pages/state.html)
    { word: '바글바글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 1, path: 'assets/StatusFeeling/1.gif', page: '/pages/state.html' },
    { word: '보글보글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 2, path: 'assets/StatusFeeling/2.gif', page: '/pages/state.html' },
    { word: '부글부글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 3, path: 'assets/StatusFeeling/3.gif', page: '/pages/state.html' },
    { word: '빠글빠글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 4, path: 'assets/StatusFeeling/4.gif', page: '/pages/state.html' },
    { word: '뽀글뽀글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 5, path: 'assets/StatusFeeling/5.gif', page: '/pages/state.html' },
    { word: '뿌글뿌글', category: 'state', categoryName: '상태/느낌', group: '바글바글 계열', index: 6, path: 'assets/StatusFeeling/6.gif', page: '/pages/state.html' },

    { word: '잔득잔득', category: 'state', categoryName: '상태/느낌', group: '잔득잔득 계열', index: 7, path: 'assets/StatusFeeling/7.gif', page: '/pages/state.html' },
    { word: '진득진득', category: 'state', categoryName: '상태/느낌', group: '잔득잔득 계열', index: 8, path: 'assets/StatusFeeling/8.gif', page: '/pages/state.html' },
    { word: '짠득짠득', category: 'state', categoryName: '상태/느낌', group: '잔득잔득 계열', index: 9, path: 'assets/StatusFeeling/9.gif', page: '/pages/state.html' },
    { word: '찐득찐득', category: 'state', categoryName: '상태/느낌', group: '잔득잔득 계열', index: 10, path: 'assets/StatusFeeling/10.gif', page: '/pages/state.html' },

    // 2. 표정/감정 (/pages/expression.html)
    { word: '상글상글', category: 'expression', categoryName: '표정/감정', group: '상글상글 계열', index: 1, path: 'assets/Smile/1.gif', page: '/pages/expression.html' },
    { word: '싱글싱글', category: 'expression', categoryName: '표정/감정', group: '상글상글 계열', index: 2, path: 'assets/Smile/2.gif', page: '/pages/expression.html' },
    { word: '쌍글쌍글', category: 'expression', categoryName: '표정/감정', group: '상글상글 계열', index: 3, path: 'assets/Smile/3.gif', page: '/pages/expression.html' },
    { word: '씽글씽글', category: 'expression', categoryName: '표정/감정', group: '상글상글 계열', index: 4, path: 'assets/Smile/4.gif', page: '/pages/expression.html' },

    { word: '방긋방긋', category: 'expression', categoryName: '표정/감정', group: '방긋방긋 계열', index: 5, path: 'assets/Smile/5.gif', page: '/pages/expression.html' },
    { word: '벙긋벙긋', category: 'expression', categoryName: '표정/감정', group: '방긋방긋 계열', index: 6, path: 'assets/Smile/6.gif', page: '/pages/expression.html' },
    { word: '빵긋빵긋', category: 'expression', categoryName: '표정/감정', group: '방긋방긋 계열', index: 7, path: 'assets/Smile/7.gif', page: '/pages/expression.html' },
    { word: '뻥긋뻥긋', category: 'expression', categoryName: '표정/감정', group: '방긋방긋 계열', index: 8, path: 'assets/Smile/8.gif', page: '/pages/expression.html' },

    // 3. 빛/색깔 (/pages/light.html)
    { word: '반짝반짝', category: 'light', categoryName: '빛/색깔', group: '반짝반짝 계열', index: 1, path: 'assets/Light/1.gif', page: '/pages/light.html' },
    { word: '번쩍번쩍', category: 'light', categoryName: '빛/색깔', group: '반짝반짝 계열', index: 2, path: 'assets/Light/2.gif', page: '/pages/light.html' },
    { word: '빤짝빤짝', category: 'light', categoryName: '빛/색깔', group: '반짝반짝 계열', index: 3, path: 'assets/Light/3.gif', page: '/pages/light.html' },
    { word: '뻔쩍뻔쩍', category: 'light', categoryName: '빛/색깔', group: '반짝반짝 계열', index: 4, path: 'assets/Light/4.gif', page: '/pages/light.html' },

    { word: '노릇노릇', category: 'light', categoryName: '빛/색깔', group: '노릇노릇 계열', index: 5, path: 'assets/Light/5.gif', page: '/pages/light.html' },
    { word: '누릇누릇', category: 'light', categoryName: '빛/색깔', group: '노릇노릇 계열', index: 6, path: 'assets/Light/6.gif', page: '/pages/light.html' },
    { word: '노름노름', category: 'light', categoryName: '빛/색깔', group: '노릇노릇 계열', index: 7, path: 'assets/Light/7.gif', page: '/pages/light.html' },
    { word: '누름누름', category: 'light', categoryName: '빛/색깔', group: '노릇노릇 계열', index: 8, path: 'assets/Light/8.gif', page: '/pages/light.html' },

    // 4. 모양/외형 (/pages/shape.html)
    { word: '고불고불', category: 'shape', categoryName: '모양/외형', group: '고불고불 계열', index: 1, path: 'assets/Shape/1.gif', page: '/pages/shape.html' },
    { word: '구불구불', category: 'shape', categoryName: '모양/외형', group: '고불고불 계열', index: 2, path: 'assets/Shape/2.gif', page: '/pages/shape.html' },
    { word: '꼬불꼬불', category: 'shape', categoryName: '모양/외형', group: '고불고불 계열', index: 3, path: 'assets/Shape/3.gif', page: '/pages/shape.html' },
    { word: '꾸불꾸불', category: 'shape', categoryName: '모양/외형', group: '고불고불 계열', index: 4, path: 'assets/Shape/4.gif', page: '/pages/shape.html' },

    { word: '보동보동', category: 'shape', categoryName: '모양/외형', group: '보동보동 계열', index: 5, path: 'assets/Shape/5.gif', page: '/pages/shape.html' },
    { word: '부둥부둥', category: 'shape', categoryName: '모양/외형', group: '보동보동 계열', index: 6, path: 'assets/Shape/6.gif', page: '/pages/shape.html' },
    { word: '포동포동', category: 'shape', categoryName: '모양/외형', group: '보동보동 계열', index: 7, path: 'assets/Shape/7.gif', page: '/pages/shape.html' },
    { word: '푸둥푸둥', category: 'shape', categoryName: '모양/외형', group: '보동보동 계열', index: 8, path: 'assets/Shape/8.gif', page: '/pages/shape.html' },

    // 5. 사람소리 (/pages/person-sound.html)
    { word: '깔깔', category: 'person-sound', categoryName: '사람소리', group: '깔깔 계열', index: 1, path: 'assets/People/1.gif', page: '/pages/person-sound.html' },
    { word: '낄낄', category: 'person-sound', categoryName: '사람소리', group: '깔깔 계열', index: 2, path: 'assets/People/2.gif', page: '/pages/person-sound.html' },
    { word: '껄껄', category: 'person-sound', categoryName: '사람소리', group: '깔깔 계열', index: 3, path: 'assets/People/3.gif', page: '/pages/person-sound.html' },

    { word: '칼락칼락', category: 'person-sound', categoryName: '사람소리', group: '칼락칼락 계열', index: 4, path: 'assets/People/4.gif', page: '/pages/person-sound.html' },
    { word: '콜록콜록', category: 'person-sound', categoryName: '사람소리', group: '칼락칼락 계열', index: 5, path: 'assets/People/5.gif', page: '/pages/person-sound.html' },
    { word: '쿨럭쿨럭', category: 'person-sound', categoryName: '사람소리', group: '칼락칼락 계열', index: 6, path: 'assets/People/6.gif', page: '/pages/person-sound.html' },

    // 6. 사물소리 (/pages/object-sound.html)
    { word: '잘각잘각', category: 'object-sound', categoryName: '사물소리', group: '잘각잘각 계열', index: 1, path: 'assets/Object/1.gif', page: '/pages/object-sound.html' },
    { word: '절걱절걱', category: 'object-sound', categoryName: '사물소리', group: '잘각잘각 계열', index: 2, path: 'assets/Object/2.gif', page: '/pages/object-sound.html' },
    { word: '찰칵찰칵', category: 'object-sound', categoryName: '사물소리', group: '잘각잘각 계열', index: 3, path: 'assets/Object/3.gif', page: '/pages/object-sound.html' },
    { word: '철컥철컥', category: 'object-sound', categoryName: '사물소리', group: '잘각잘각 계열', index: 4, path: 'assets/Object/4.gif', page: '/pages/object-sound.html' },

    { word: '오르르', category: 'object-sound', categoryName: '사물소리', group: '오르르 계열', index: 5, path: 'assets/Object/5.gif', page: '/pages/object-sound.html' },
    { word: '와르르', category: 'object-sound', categoryName: '사물소리', group: '오르르 계열', index: 6, path: 'assets/Object/6.gif', page: '/pages/object-sound.html' },
    { word: '워르르', category: 'object-sound', categoryName: '사물소리', group: '오르르 계열', index: 7, path: 'assets/Object/7.gif', page: '/pages/object-sound.html' },
    { word: '우르르', category: 'object-sound', categoryName: '사물소리', group: '오르르 계열', index: 8, path: 'assets/Object/8.gif', page: '/pages/object-sound.html' },

    // 7. 자연 (/pages/nature.html)
    { word: '솨솨', category: 'nature', categoryName: '자연', group: '솨솨 계열', index: 1, path: 'assets/Nature/1.gif', page: '/pages/nature.html' },
    { word: '쏴쏴', category: 'nature', categoryName: '자연', group: '솨솨 계열', index: 2, path: 'assets/Nature/2.gif', page: '/pages/nature.html' },
    { word: '쇄쇄', category: 'nature', categoryName: '자연', group: '솨솨 계열', index: 3, path: 'assets/Nature/3.gif', page: '/pages/nature.html' },
    { word: '쐐쐐', category: 'nature', categoryName: '자연', group: '솨솨 계열', index: 4, path: 'assets/Nature/4.gif', page: '/pages/nature.html' },

    { word: '잘잘', category: 'nature', categoryName: '자연', group: '잘잘 계열', index: 5, path: 'assets/Nature/5.gif', page: '/pages/nature.html' },
    { word: '줄줄', category: 'nature', categoryName: '자연', group: '잘잘 계열', index: 6, path: 'assets/Nature/6.gif', page: '/pages/nature.html' },
    { word: '짤짤', category: 'nature', categoryName: '자연', group: '잘잘 계열', index: 7, path: 'assets/Nature/7.gif', page: '/pages/nature.html' },
    { word: '쭐쭐', category: 'nature', categoryName: '자연', group: '잘잘 계열', index: 8, path: 'assets/Nature/8.gif', page: '/pages/nature.html' }
  ];

  /**
   * 입력된 검색어에 대한 최적의 단어 항목 1개 검색
   * 1) 완전 일치
   * 2) 공백 제거 일치
   * 3) 전방 일치 (startsWith)
   * 4) 부분 일치 (includes)
   * 5) 계열어명 매칭 (예: '장알장알 계열')
   * 6) 에셋 경로 매칭 (예: 'assets/People/4' 또는 'People/4')
   */
  function searchSorigyeolWord(rawQuery) {
    if (!rawQuery) return null;
    const q = rawQuery.trim().toLowerCase();
    const cleanQ = q.replace(/\s+/g, '');
    if (!cleanQ) return null;

    // 1) 완전 일치
    let match = SORIGYEOL_WORDS.find((item) => item.word === rawQuery.trim());
    if (match) return match;

    // 2) 공백 제거 일치
    match = SORIGYEOL_WORDS.find((item) => item.word.replace(/\s+/g, '') === cleanQ);
    if (match) return match;

    // 3) 단어가 검색어로 시작
    match = SORIGYEOL_WORDS.find((item) => item.word.startsWith(cleanQ));
    if (match) return match;

    // 4) 단어에 검색어 포함
    match = SORIGYEOL_WORDS.find((item) => item.word.includes(cleanQ));
    if (match) return match;

    // 5) 검색어가 단어를 포함 (예: '쫑알쫑알 사전', '쫑알쫑알 소리')
    match = SORIGYEOL_WORDS.find((item) => cleanQ.includes(item.word.replace(/\s+/g, '')));
    if (match) return match;

    // 6) 계열어 이름 매칭 (예: '잘잘 계열' -> 잘잘)
    match = SORIGYEOL_WORDS.find((item) => item.group.replace(/\s+/g, '').includes(cleanQ));
    if (match) return match;

    // 7) 에셋 경로 매칭 (예: 'people/4', 'assets/People/4')
    match = SORIGYEOL_WORDS.find((item) => item.path.toLowerCase().includes(cleanQ));
    if (match) return match;

    return null;
  }

  /**
   * 실시간 자동완성용 다중 결과 필터링
   */
  function filterSorigyeolWords(rawQuery, limit = 6) {
    if (!rawQuery) return [];
    const q = rawQuery.trim().toLowerCase();
    const cleanQ = q.replace(/\s+/g, '');
    if (!cleanQ) return [];

    const results = [];
    const seen = new Set();

    // 1순위: 시작 일치
    for (const item of SORIGYEOL_WORDS) {
      if (item.word.startsWith(cleanQ) && !seen.has(item.word)) {
        results.push(item);
        seen.add(item.word);
        if (results.length >= limit) return results;
      }
    }

    // 2순위: 부분 일치
    for (const item of SORIGYEOL_WORDS) {
      if (item.word.includes(cleanQ) && !seen.has(item.word)) {
        results.push(item);
        seen.add(item.word);
        if (results.length >= limit) return results;
      }
    }

    // 3순위: 계열명 일치
    for (const item of SORIGYEOL_WORDS) {
      if (item.group.replace(/\s+/g, '').includes(cleanQ) && !seen.has(item.word)) {
        results.push(item);
        seen.add(item.word);
        if (results.length >= limit) return results;
      }
    }

    return results;
  }

  // 전역 노출
  window.SORIGYEOL_WORDS = SORIGYEOL_WORDS;
  window.searchSorigyeolWord = searchSorigyeolWord;
  window.filterSorigyeolWords = filterSorigyeolWords;
})();
