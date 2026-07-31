# Dotzari 디자인 탐색

지금까지 합의한 제품 방향을 바탕으로 만든 비규범적(non-normative) UI 탐색 자료다.
아직 최종 디자인 결정이 아니며, 비교·논의 후 선택한 방향만 SSOT의 제품 결정으로
반영한다.

공개 미리보기는 [dotzari.memos.my](https://dotzari.memos.my)에서 볼 수 있다.
Jamserver의 `dotzari` 앱으로 등록되어 있으며, 별도 종료 시각 없이 계속 실행된다.

현재 `index.html`은 1차 탐색의 **Slide Studio**와 **Concept Atlas**를 결합해 발전시킨
세 가지 데스크톱 Editor 시안을 담고 있다.

1. **Slide + Concept** — 익숙한 슬라이드 편집기에 개념 에셋을 자연스럽게 더한 균형형
2. **Concept Dock** — 개념 검색, 재사용, 관계 파악을 작업의 출발점으로 삼는 라이브러리 중심형
3. **Narrative Rail** — 설명 순서와 등장 개념, 애니메이션을 한 흐름에서 설계하는 구성 중심형

모든 시안은 밝은 **Paper**와 어두운 **Midnight** 테마를 제공한다. 상단 시안 탭과
테마 전환, 단계·개념·노드 선택, Narrative Rail의 재생 버튼을 조작해 볼 수 있다.

초기 다섯 방향은 [`five-directions.html`](./five-directions.html)에 보존한다.
현재 2차 시안의 독립 사본은 [`iteration-2.html`](./iteration-2.html)이다.

로컬에서 확인하려면 이 디렉터리에서 `node server.mjs`를 실행한 뒤
`http://127.0.0.1:4318`을 연다.
