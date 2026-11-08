/* ==========================================================================
   detail.js — 상태·느낌 및 상세 페이지 인터랙션 스크립트
   - 계열어 클릭 시:
     1) 사이드바 너비 240px(2/3 수준) & #555555 배경색 축소 전환
     2) 상태·느낌 텍스트 이미지 폭(15px)으로 축소, 설명 텍스트 숨김
     3) 계열어 칩 숨김 & 00계열 텍스트만 남김
     4) 우측 상단 100px 거리에 오른쪽 정렬로 뜻 노출
     5) 중앙 348*603 크기의 assets/StatusFeeling/n.gif 에셋 로드 (미등록 시 시안의 빨간 박스 플레이스홀더)
     6) 우측 하단 85px 갭으로 계열어 가로 선택지 이동 (활성단어 28pt #000000, 비활성단어 24pt #6F6F6F)
   ========================================================================== */

(function () {
  'use strict';

  // 단어별 표준 뜻 사전 (StatusFeeling)
  const WORD_MEANINGS = {
    '바글바글': '적은 양의 액체가 자꾸 넓게 퍼지며 끓거나 솟아오르는 소리',
    '보글보글': '적은 양의 액체가 부드럽게 끓어오르는 소리 또는 모양',
    '부글부글': '많은 양의 액체가 굵은 거품을 내며 요란하게 끓는 소리 또는 모양',
    '빠글빠글': '적은 양의 액체가 거품을 세차게 내며 몹시 끓는 소리 또는 모양',
    '뽀글뽀글': '작은 방울이 잇따라 솟아오르며 끓는 소리 또는 모양',
    '뿌글뿌글': '많은 양의 거품이 되직하게 끓어오르는 소리 또는 모양',

    '보슬보슬': '눈이나 비가 가늘고 부드럽게 내리는 모양',
    '부슬부슬': '눈이나 비가 성기게 잇따라 내리는 모양',
    '포슬포슬': '흙이나 가루 따위가 물기가 적어 가볍고 부드럽게 흩어지는 모양',
    '푸슬푸슬': '물기가 적어 메마르고 푸석하게 흩어지는 모양',

    '바삭바삭': '물기가 없는 얇은 물체가 가볍게 부스러지는 소리 또는 모양',
    '버석버석': '물기 없는 다소 거친 물체가 부스러질 때 나는 둔탁한 소리',
    '빠삭빠삭': '매우 단단하고 얇은 물체가 바스러지며 나는 한층 센 소리',
    '뻐석뻐석': '굵고 거친 물체가 바스러질 때 나는 크고 무거운 소리',

    '자릿자릿': '살갗이나 신경에 미약한 전율이나 마비가 잇따라 느껴지는 상태',
    '저릿저릿': '몸의 한 부분이 피가 잘 통하지 않아 둔하고 얼얼한 느낌이 연속되는 상태',
    '짜릿짜릿': '순간적으로 강한 자극이나 전율이 잇따라 전해지는 느낌',
    '쩌릿쩌릿': '매우 강렬한 저림이나 충격이 깊게 느껴지는 상태',

    '잔득잔득': '물기가 있는 물질이 꽤 끈기 있게 달라붙는 모양',
    '진득진득': '끈끈한 성질이 강하여 찰지게 들러붙는 모양',
    '짠득짠득': '몹시 차지고 끈기 있게 쩍쩍 들러붙는 모양',
    '찐득찐득': '끈적임이 매우 심하여 엉겨 붙는 모양',
    '존득존득': '부드럽고 찰지게 씹히거나 늘어나는 모양',
    '준득준득': '다소 무겁고 굵직하게 차진 모양',
    '쫀득쫀득': '매우 탄력 있고 찰기가 넘치게 씹히는 모양',
    '쭌득쭌득': '한층 더 굵고 세게 차진 모양',

    '가물가물': '기억이나 시야가 아득하여 희미하게 보였다 안 보였다 하는 상태',
    '거물거물': '어둡거나 먼 대상이 굵직하고 희미하게 어른거리는 상태',
    '사물사물': '눈앞의 형체가 가볍게 흔들리며 아른거리는 상태',
    '서물서물': '기억이나 형체가 조금 엉성하고 흐릿하게 떠오르는 상태',

    '도렷도렷': '사물의 모양이나 의식이 또렷하고 분명한 상태',
    '두렷두렷': '크고 굵은 형체가 또렷하게 두드러진 모양',
    '또렷또렷': '눈에 띄게 똑똑하고 분명한 상태',
    '뚜렷뚜렷': '아주 확실하고 분명하여 조금도 흐리지 않은 상태',

    // 표정/감정 (Smile)
    '방긋방긋': '입술을 약간 벌리고 소리 없이 환하게 자꾸 웃는 모양',
    '벙긋벙긋': '입을 약간 크게 벌리고 소리 없이 환하게 자꾸 웃는 모양',
    '빵긋빵긋': '입술을 조금 오므리며 귀엽고 발랄하게 자꾸 웃는 모양',
    '뻥긋뻥긋': '입을 살짝 크게 열며 시원스럽게 자꾸 웃는 모양',

    '상글상글': '눈매와 입매를 부드럽고 상냥하게 좁히며 자꾸 웃는 모양',
    '쌍글쌍글': '눈매를 동글동글 깜찍하게 굴리며 귀엽고 생기 있게 웃는 모양',
    '싱글싱글': '기분이 좋아 얼굴에 가볍고 은근한 웃음을 자꾸 띠는 모양',
    '씽글씽글': '매우 신나고 만족스러워 입가에 가득 웃음을 연신 짓는 모양',
    '생글생글': '눈과 입에 활기차고 맑은 웃음을 상쾌하게 자꾸 띠는 모양',
    '쌩글쌩글': '매우 또렷하고 야무지게 얼굴 전체에 가득 활짝 웃는 모양',

    '방글방글': '소리 없이 천진난만하고 정답게 자꾸 웃는 모양',
    '뱅글뱅글': '입가에 잔잔하고 은은하게 미소를 자꾸 머금는 모양',
    '벙글벙글': '기쁨을 참지 못하여 입을 다소 크게 벌리고 연신 흐뭇하게 웃는 모양',
    '빙글빙글': '입술을 동그랗게 모으고 즐거움에 겨워 연신 온화하게 웃는 모양',

    // 빛/색깔 (Light)
    '반짝반짝': '작은 빛이 잠깐씩 잇따라 밝게 빛나는 모양',
    '번쩍번쩍': '큰 빛이 잠깐씩 잇따라 아주 밝게 빛나는 모양',
    '빤짝빤짝': '작은 빛이 아주 맑고 또렷하게 잇따라 빛나는 모양',
    '뻔쩍뻔쩍': '큰 빛이 아주 강렬하고 힘차게 잇따라 빛나는 모양',

    '노릇노릇': '군데군데 고르게 옅은 노란빛을 띠며 알맞게 익은 모양',
    '누릇누릇': '군데군데 짙고 어두운 노란빛을 띠는 모양',
    '노름노름': '전체적으로 연하고 고운 노란빛을 골고루 띠는 모양',
    '누름누름': '전체적으로 짙고 칙칙한 노란빛을 고루 띠는 모양',

    '반들반들': '물체의 표면이 매끄럽고 윤이 나는 모양',
    '번들번들': '기름기나 물기로 물체의 표면이 유난히 번쩍이며 윤이 나는 모양',
    '빤들빤들': '몹시 매끄럽고 윤택하여 보드랍게 번쩍이는 모양',
    '뻔들뻔들': '기름기 따위가 몹시 두텁게 번쩍이며 윤이 나는 모양',

    // 사물소리 (Object)
    '사각사각': '얇거나 바삭한 물건이 가볍게 스치거나 썰리는 소리',
    '서걱서걱': '거칠거나 굵은 물건이 맞비벼지거나 베어지는 소리',
    '싸각싸각': '단단하고 마른 물건이 잇따라 잘게 썰리는 또렷한 소리',
    '써걱써걱': '거친 물건이 잇따라 거세게 썰리거나 베어지는 소리',

    '잘각잘각': '얇고 작은 쇠붙이나 단단한 물건이 가볍게 부딪치는 소리',
    '절걱절걱': '크고 묵직한 쇠붙이나 단단한 물건이 연달아 부딪치는 소리',
    '찰칵찰칵': '쇠붙이의 잠금장치나 카메라 셔터 따위가 작게 물려 닫히는 소리',
    '철컥철컥': '크고 무거운 쇠붙이가 힘있게 맞물려 잠기거나 부딪치는 소리',

    '오르르': '작고 가벼운 알갱이들이 한꺼번에 쏟아지거나 구르는 소리',
    '와르르': '많은 물건이나 거대한 더미가 한꺼번에 무너지거나 쏟아지는 소리',
    '워르르': '여러 사람이나 사물이 한꺼번에 거세게 쏠려 움직이는 소리',
    '우르르': '무겁고 많은 물체가 한꺼번에 크고 묵직하게 쏟아져 내리는 소리',

    // 사람소리 (People)
    '장알장알': '낮은 목소리로 잔재미있게 끊임없이 이야기하는 소리',
    '짱알짱알': '약간 새된 소리로 앙칼지게 쉬지 않고 조잘대는 소리',
    '종알종알': '조그마한 입으로 잔소리를 잇따라 조잘거리는 소리',
    '쫑알쫑알': '쉴 새 없이 귀엽거나 얄밉게 자꾸 지껄이는 소리',
    '중얼중얼': '남이 알아듣기 힘들 만큼 입속으로 혼자 읊조리는 소리',
    '쭝얼쭝얼': '못마땅하여 입속으로 불평을 자꾸 낮게 내는 소리',

    '깔깔': '목청을 돋우어 맑고 높게 호쾌하게 웃는 소리',
    '낄낄': '남모르게 속으로 웃거나 낮고 간사하게 웃는 소리',
    '껄껄': '입을 크게 벌리고 활달하고 호탕하게 웃는 소리',

    '콜록콜록': '목구멍이 간지러워 잇따라 가볍게 기침하는 소리',
    '쿨럭쿨럭': '가슴속 깊은 곳에서 울려 나오는 묵직한 기침 소리',
    '칼락칼락': '목이 메거나 건조하여 잇따라 밭은 기침을 하는 소리',

    // 모양/외형 (Shape)
    '고불고불': '조금 잘고 둥글게 이리저리 굽어 있는 모양',
    '구불구불': '굵고 큼직하게 이리저리 여러 번 굽어 있는 모양',
    '꼬불꼬불': '잘고 몹시 둥글게 심하게 굽어 있는 모양',
    '꾸불꾸불': '굵고 큼직하게 심하게 여러 번 굽어 있는 모양',

    '보동보동': '살이 알맞게 올라 부드럽고 통통한 모양',
    '부둥부둥': '살이 부드럽고 푸짐하게 쪄서 포근한 모양',
    '포동포동': '살이 통통하고 곱게 올라 귀여운 모양',
    '푸둥푸둥': '살이 찌고 몸집이 아주 커서 둔해 보이는 모양',

    '곱슬곱슬': '털이나 머리카락 따위가 둥글고 예쁘게 말려 있는 모양',
    '굽슬굽슬': '털이나 머리카락 따위가 굵고 부드럽게 물결치듯 말려 있는 모양',
    '꼽슬꼽슬': '머리카락 따위가 잘고 또렷하게 오그라져 말려 있는 모양',
    '꿉슬꿉슬': '털 따위가 굵고 몹시 억세게 곱슬거리는 모양',

    // 자연 (Nature)
    '자글자글': '냄비의 국물 따위가 자작하게 줄어들며 끓는 소리',
    '지글지글': '기름이나 국물이 배어 나오며 요란스럽게 끓는 소리',
    '짜글짜글': '적은 국물이 바짝 졸아들며 세게 끓는 소리',
    '찌글찌글': '기름 따위가 잇따라 거칠고 요란하게 끓는 소리',

    '솔솔': '부드러운 바람이 가볍고 기분 좋게 부는 모양',
    '슬슬': '시원한 바람이 은은하게 잇따라 스쳐 부는 모양',
    '술술': '바람 따위가 막힘없이 시원스럽게 부는 모양',
    '쏠쏠': '바람 따위가 조금 가늘고 세차게 스쳐 지나가는 모양',
    '쑬쑬': '거센 바람이나 기운이 거침없이 연달아 밀려드는 모양',

    '졸졸': '좁은 틈이나 얕은 개울에서 맑은 물이 경쾌하게 흐르는 소리',
    '줄줄': '물이나 땀 따위의 액체가 굵고 끊임없이 쏟아져 흐르는 소리',
    '쫄쫄': '적은 양의 물이 가늘고 힘차게 쉬지 않고 흐르는 소리',
    '쭐쭐': '액체가 줄기차고 거세게 잇따라 흘러내리는 소리',
    '잘잘': '물이 얕게 퍼져서 경쾌하고 잔잔하게 잘 흐르는 소리',
    '절절': '많은 물이 막힘없이 풍성하고 넉넉하게 흐르는 소리',
    '짤짤': '물 따위가 몹시 팽팽하고 가늘게 줄달음쳐 흐르는 소리',
    '쩔쩔': '거센 물줄기가 잇따라 굵게 넘쳐 흐르는 소리',

    '솨솨': '세찬 비나 바람이 나뭇가지 등을 세차게 스치며 내는 소리',
    '쏴쏴': '거센 빗줄기나 폭포수가 요란하게 쏟아져 내리는 소리',
    '쇄쇄': '거센 물결이나 비바람이 날카롭게 몰아치며 내는 소리',
    '쐐쐐': '비바람이나 거센 바람줄기가 몹시 매섭게 부딪치는 소리',

    '찰랑찰랑': '그릇에 물이 가득 차서 넘칠 듯이 자꾸 가볍게 흔들리는 모양',
    '촐랑촐랑': '얕은 물이 가볍게 솟구치며 자꾸 잘게 일렁이는 모양',
    '철렁철렁': '많은 양의 물이 크게 일렁이며 출렁거리는 소리나 모양',
    '출렁출렁': '깊고 넓은 물이 무겁고 크게 자꾸 흔들리는 소리나 모양'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.detail-sidebar');
    const pageContainer = document.querySelector('.page--detail');
    const stageGif = document.querySelector('.detail-stage-gif');
    const stageFallback = document.querySelector('.detail-stage-fallback');
    const placeholderPath = document.querySelector('.detail-stage-placeholder__path');
    const meaningText = document.querySelector('.detail-meaning__text');
    const footerWords = document.querySelector('.detail-footer__words');

    if (!sidebar) return;

    // 현재 활성화된 단어 상태를 저장
    let currentWord = '';
    let currentGroupSection = null;

    /**
     * 특정 단어를 활성화하고 화면 전체(사이드바, 우측 뜻, GIF, 하단 가로 선택지)를 업데이트하는 함수
     */
    function selectWord(word, targetGroupSection) {
      if (!word) return;

      currentWord = word;
      const chip = sidebar.querySelector(`.word-chip[data-word="${word}"]`);
      const groupSection = targetGroupSection || (chip ? chip.closest('.word-group') : null);
      currentGroupSection = groupSection;

      // 1. 페이지를 활성 상태(.is-word-active)로 전환 (계열어 클릭 시에만 발생)
      document.body.classList.add('is-word-active');
      if (pageContainer) {
        pageContainer.classList.add('is-word-active');
      }

      // 2. 사이드바 계열 그룹 활성 상태 표시
      sidebar.querySelectorAll('.word-group').forEach((sec) => {
        sec.classList.toggle('is-active-group', sec === groupSection);
      });

      // 사이드바 내 칩 활성 클래스 갱신
      sidebar.querySelectorAll('.word-chip.is-active').forEach((el) => {
        el.classList.remove('is-active');
      });
      if (chip) {
        chip.classList.add('is-active');
      }

      // 3. 우측 상단 뜻(Meaning) 업데이트
      const meaning = WORD_MEANINGS[word] || '말과 소리의 섬세한 결을 나타내는 의성어·의태어';
      if (meaningText) {
        meaningText.textContent = meaning;
      }

      // 4. 에셋 경로 결정 (data-path 우선 적용)
      const index = chip ? chip.dataset.index : '1';
      let assetPath = chip ? chip.dataset.path : `assets/Smile/${index}.gif`;
      if (!assetPath.endsWith('.gif')) {
        assetPath += '.gif';
      }

      if (placeholderPath) {
        placeholderPath.textContent = assetPath;
      }

      // 5. GIF 에셋 로딩 시도 (계열어 이동 시 "gif 들어갈 곳" 플레이스홀더 노출 및 깜빡임 방지)
      if (stageGif) {
        // "gif 들어가는 곳" 플레이스홀더는 항상 숨김 처리 유지
        if (stageFallback) {
          stageFallback.classList.add('is-hidden');
        }

        const specificWordFallbacks = {
          '싱글싱글': ['assets/Smile/2.gif', 'assets/Smile/3.gif', 'assets/Smile/싱글싱글.gif'],
          '쌍글쌍글': ['assets/Smile/3.gif', 'assets/Smile/2.gif', 'assets/Smile/쌍글쌍글.gif'],
          '상글상글': ['assets/Smile/1.gif', 'assets/Smile/상글상글.gif'],
          '씽글씽글': ['assets/Smile/4.gif', 'assets/Smile/씽글씽글.gif'],
          '줄줄': ['assets/Nature/6.gif', 'assets/Nature/줄줄.gif'],
          '쭐쭐': ['assets/Nature/8.gif', 'assets/Nature/쭐쭐.gif']
        };

        const extraCandidates = specificWordFallbacks[word] || [];
        const candidatePaths = [
          `/${assetPath}`,
          assetPath,
          ...extraCandidates.flatMap((p) => [`/${p}`, p]),
          `/${assetPath.replace(/\.gif$/, '')}`,
          assetPath.replace(/\.gif$/, '')
        ];

        let loaded = false;
        const currentSelectedWord = word;

        const tryLoad = (idx) => {
          if (idx >= candidatePaths.length || loaded) return;
          // 비동기 로딩 중 다른 단어로 전환된 경우 취소
          if (currentWord !== currentSelectedWord) return;

          const imgUrl = candidatePaths[idx];
          const testImg = new Image();

          testImg.onload = () => {
            if (loaded || currentWord !== currentSelectedWord) return;
            loaded = true;
            // 새 이미지가 완전히 준비되었을 때만 src 교체하여 끊김/깜빡임 없음
            stageGif.src = imgUrl;
            stageGif.alt = word;
            stageGif.classList.add('is-visible');
            if (stageFallback) {
              stageFallback.classList.add('is-hidden');
            }
          };

          testImg.onerror = () => {
            if (currentWord === currentSelectedWord) {
              tryLoad(idx + 1);
            }
          };

          testImg.src = imgUrl;
        };

        tryLoad(0);
      }

      // 6. 우측 하단 계열어 가로 선택지 렌더링
      if (footerWords && groupSection) {
        const chips = groupSection.querySelectorAll('.word-chip');
        footerWords.innerHTML = '';

        chips.forEach((btn) => {
          const w = btn.dataset.word;
          const footerBtn = document.createElement('button');
          footerBtn.type = 'button';
          footerBtn.className = 'footer-word-btn' + (w === word ? ' is-active' : '');
          footerBtn.dataset.word = w;
          footerBtn.textContent = w;

          footerBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            selectWord(w, groupSection);
          });

          footerWords.appendChild(footerBtn);
        });
      }

      // 커스텀 이벤트 디스패치
      window.dispatchEvent(
        new CustomEvent('sorigyeol:wordchange', {
          detail: { word, index, path: assetPath }
        })
      );
    }

    // A. 사이드바 내 단어 칩 클릭
    sidebar.addEventListener('click', (e) => {
      const btn = e.target.closest('.word-chip');
      if (btn) {
        const word = btn.dataset.word;
        const groupSection = btn.closest('.word-group');
        selectWord(word, groupSection);
        return;
      }

      // B. 축소된 사이드바에서 '00계열' 타이틀 클릭 시 해당 계열의 첫 번째 단어로 전환
      const titleBtn = e.target.closest('.word-group__title');
      if (titleBtn) {
        const groupSection = titleBtn.closest('.word-group');
        if (groupSection) {
          const firstChip = groupSection.querySelector('.word-chip');
          if (firstChip) {
            selectWord(firstChip.dataset.word, groupSection);
          }
        }
      }
    });

    // C. 사이드바 타이틀 클릭 시 (선택 상태일 경우 초기 전체 목록으로 복귀)
    const titleEl = sidebar.querySelector('.detail-sidebar__title');
    if (titleEl) {
      titleEl.addEventListener('click', () => {
        if (document.body.classList.contains('is-word-active')) {
          document.body.classList.remove('is-word-active');
          if (pageContainer) pageContainer.classList.remove('is-word-active');
          sidebar.querySelectorAll('.word-group').forEach((sec) => sec.classList.remove('is-active-group'));
          sidebar.querySelectorAll('.word-chip').forEach((el) => el.classList.remove('is-active'));
        }
      });
    }

    // D. 외부 및 GNB 검색창 연동용 전역 API 노출
    window.SorigyeolDetail = {
      selectWord: (word) => {
        selectWord(word);
        const chip = sidebar.querySelector(`.word-chip[data-word="${word}"]`);
        if (chip) {
          chip.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    };

    // E. URL 파라미터(?word=...) 확인 및 해당 계열어 자동 활성화 (예: 쫑알쫑알 검색 후 진입 시)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetWord = urlParams.get('word');
      if (targetWord) {
        const decodedWord = decodeURIComponent(targetWord).trim();
        // 정확히 일치하는 칩 검색
        let matchedChip = sidebar.querySelector(`.word-chip[data-word="${decodedWord}"]`);

        // 만약 완전 일치 칩이 없다면 공백 무시 또는 부분 일치 검색
        if (!matchedChip) {
          const allChips = Array.from(sidebar.querySelectorAll('.word-chip'));
          matchedChip = allChips.find(
            (c) => c.dataset.word === decodedWord ||
                   c.dataset.word.replace(/\s+/g, '') === decodedWord.replace(/\s+/g, '') ||
                   c.dataset.word.includes(decodedWord) ||
                   c.dataset.index === decodedWord
          );
        }

        if (matchedChip) {
          const word = matchedChip.dataset.word;
          const groupSection = matchedChip.closest('.word-group');
          selectWord(word, groupSection);
          // 해당 칩이 보이도록 스크롤 이동
          setTimeout(() => {
            matchedChip.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }, 150);
        }
      }
    } catch (err) {
      console.warn('URL parameter parsing failed:', err);
    }
  });
})();


