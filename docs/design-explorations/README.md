# Dotzari 디자인 탐색

지금까지 합의한 제품 방향을 바탕으로 만든 비규범적(non-normative) UI 탐색 자료다.
아직 최종 디자인 결정이 아니며, 비교·논의 후 선택한 방향만 SSOT의 제품 결정으로
반영한다.

공개 미리보기는 [dotzari.memos.my](https://dotzari.memos.my)에서 볼 수 있다.
Jamserver의 `dotzari` 앱으로 등록되어 있으며, 별도 종료 시각 없이 계속 실행된다.

브라우저에서 [`index.html`](./index.html)을 열면 다음 다섯 가지 안을 한 화면에서
전환해 볼 수 있다.

1. **Slide Studio** — PowerPoint에 가까운 데스크톱 Editor
2. **Concept Atlas** — 재사용 개념 에셋과 지식 그래프 중심
3. **Focus Deck** — 설명 흐름과 발표 집중도를 우선한 Editor
4. **Pocket Lesson** — 모바일 소비자 Viewer 중심
5. **Live Bridge** — 데스크톱 Editor와 모바일 Viewer 동시 미리보기

각 안의 상단 탭, 단계 버튼, 다음 단계 버튼, 밑줄 친 개념 링크를 조작할 수 있다.

로컬에서 확인하려면 이 디렉터리에서 `node server.mjs`를 실행한 뒤
`http://127.0.0.1:4318`을 연다.

