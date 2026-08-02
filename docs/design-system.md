# Dotzari 디자인 시스템

이 문서는 `docs/product-spec.md`의 D-018을 구현하는 컴포넌트·token·캔버스 상호작용
기준이다. 제품 의도와 우선순위는 SSOT가 우선하며, 이 문서는 실제 코드의 구조와 사용법을
구체화한다. 현재 패키지 이름은 workspace 내부 작업명이며 public package 이름은 Q-005에서
결정한다.

## 1. 계층

| 계층 | 책임 | 프레임워크 의존성 |
| --- | --- | --- |
| Foundation | semantic color, typography, spacing, radius, shadow, motion, layer token | 없음 |
| Interaction | canvas state transition, geometry, automatic cluster suggestion | 없음 |
| Svelte UI | 일반 UI와 canvas component, DOM event와 ARIA 연결 | Svelte |
| Catalog app | 실제 조합, 상태 비교, Editor·Viewer 관점 검증 | Svelte |

Foundation과 Interaction은 DOM 또는 Svelte를 import하지 않는다. DOM에서 pointer capture,
focus, `data-canvas-no-drag`를 해석하는 일은 Svelte component가 담당한다.

## 2. Semantic token

Token은 실제 색상 이름이 아니라 사용 목적을 나타낸다. Paper와 Midnight는 같은 token key에
서로 다른 값을 제공한다.

| 범주 | 주요 token | 용도 |
| --- | --- | --- |
| Surface | `--dz-surface-page`, `panel`, `raised`, `canvas` | 페이지, 패널, 떠 있는 요소, 캔버스 |
| Text | `--dz-text-primary`, `secondary`, `inverse` | 본문, 보조 설명, 반전 텍스트 |
| Border | `--dz-border-subtle`, `strong`, `interactive` | 구분선, 카드 경계, 선택 가능한 경계 |
| Accent | `--dz-accent`, `accent-soft`, `success`, `warning` | 선택, 강조, 완료, 주의 |
| Spacing | `--dz-space-1`부터 `--dz-space-8` | 4px 기준 간격 scale |
| Shape | `--dz-radius-sm`, `md`, `lg`, `pill` | control, card, panel, 상태 표시 |
| Motion | `--dz-duration-fast`, `normal`, `--dz-ease-standard` | hover, 선택, viewport 전환 |
| Layer | `--dz-layer-edge`, `node`, `selection`, `overlay` | canvas 내부 stacking order |

Component CSS에서는 원시 hex 값을 직접 사용하지 않는다. 코드·영상 preview처럼 콘텐츠
자체의 표현이 필요한 예외만 component 전용 token을 추가한다.

## 3. 일반 UI component

| Component | 핵심 props | 필수 상태 |
| --- | --- | --- |
| `Button` | `variant`, `size`, `disabled` | default, hover, focus, disabled |
| `IconButton` | `label`, `pressed`, `size` | default, hover, focus, pressed, disabled |
| `Badge` | `tone` | neutral, accent, success, warning |
| `SegmentedControl` | `items`, `value`, `onchange` | selected, unselected, focus |
| `Field` | `label`, `value`, `hint`, `error` | default, focus, error, disabled |
| `Panel` | `title`, `description`, `count` | default, raised, scrollable |

Badge에는 문장을 넣지 않는다. 상태 설명은 Panel이나 일반 텍스트가 담당한다.

## 4. Canvas component

| Component | 책임 |
| --- | --- |
| `CanvasSurface` | world transform, pointer·wheel·keyboard routing, background, focus entry |
| `CanvasNode` | node state, title·description·child trigger, selection ring |
| `EdgeLayer` | 측정 또는 model bounds에 붙는 edge path와 label |
| `CanvasControls` | tool, zoom in·out·reset, 현재 zoom 표시 |
| `ChildNodeTrigger` | 부모 안의 하위 노드 상세 affordance와 gesture 차단 |
| `NodeDetailPanel` | 부모 경로, 설명, 예시, 닫기·집중 보기 action |
| `ClusterSuggestion` | 자동 묶음 상태, member 요약, review action |
| `InteractionStatus` | 현재 tool·selection·gesture 상태를 문구와 live region으로 표시 |

## 5. 개념 참조와 전역 Overlay

`ConceptReference`는 본문, DOM node, SVG label, canvas text hit region에서 같은 상태와
시각 언어를 사용한다. 글자와 가까운 점선 밑줄이 기본 affordance이며 별도의 사용법 문장을
반복해서 붙이지 않는다.

`ConceptPreview`는 참조가 속한 container 안이 아니라 앱 최상위 `PortalLayer`에 렌더링한다.
따라서 canvas transform, node clipping, phone preview, scroll panel 경계를 넘어 화면 전체에서
활성화한 참조 바로 옆에 떠야 한다.

| 입력 표면 | Anchor | 접근성 control |
| --- | --- | --- |
| HTML·DOM node | 참조 요소의 client rect | 실제 button 또는 link semantics |
| SVG | focus 가능한 SVG 요소의 client rect | `tabindex`, role, accessible name |
| Canvas | hit test가 반환한 screen-space virtual rect | 같은 위치와 이름을 가진 DOM control |

Overlay placement는 `bottom-start → top-start → right → left` 순서로 남는 공간을 확인하고,
viewport 안쪽으로 보정한다. scroll, resize, zoom, pan 뒤에는 anchor를 다시 측정한다. 닫기는
바깥 click, `Escape`, 닫기 button을 모두 지원하고 focus를 원래 참조로 돌려보낸다.

## 6. Canvas interaction state

```ts
type CanvasMode =
  | 'idle'
  | 'hovering-node'
  | 'dragging-node'
  | 'panning-canvas'
  | 'connecting'
  | 'reviewing-cluster';
```

| 입력 | 조건 | 상태 변화 | 영속 변경 |
| --- | --- | --- | --- |
| node click | select tool | node 선택 | selection만 변경 |
| node pointer drag | select tool, drag 차단 영역 아님 | `dragging-node` | pointer up에서 위치 1회 commit |
| background pointer drag | pan tool 또는 middle button | `panning-canvas` | pointer up에서 viewport commit |
| wheel·trackpad | canvas focus 또는 hover | cursor를 기준으로 zoom | viewport commit |
| `Arrow` | node 선택 | grid 1칸 이동 | 위치 command 1회 |
| `Shift+Arrow` | node 선택 | grid 10칸 이동 | 위치 command 1회 |
| `Escape` | interaction 진행 중 | 취소 후 idle | 없음 |
| child trigger click | `data-canvas-no-drag` | detail 열기 | 소비자 interaction state |
| zoom이 묶음 임계값 이하 | 자동 묶음 사용 | `reviewing-cluster` | 제안 자체는 저장하지 않음 |

### Gesture 우선순위

1. 버튼, 입력, 링크, `data-canvas-no-drag`가 있는 요소
2. node resize·connect handle
3. node drag
4. canvas pan
5. canvas selection clear

상위 우선순위에서 처리한 pointer event는 하위 gesture를 시작하지 않는다. Component는
pointer ID를 유지하고 pointer capture를 사용하며, cancel과 component destroy에서 반드시
session을 정리한다.

## 7. 접근성

- CanvasSurface는 focus 가능하고 사용할 수 있는 keyboard 조작을 accessible name에 포함한다.
- CanvasNode는 선택 상태를 `aria-selected`로 전달하고 focus ring을 제공한다.
- IconButton은 보이는 text가 없어도 `aria-label`이 필수다.
- ChildNodeTrigger는 이름뿐 아니라 `상세 보기`라는 결과를 accessible name에 포함한다.
- 선택·drag·zoom 상태는 색상 외에 outline, cursor, text status로도 전달한다.
- `prefers-reduced-motion`에서는 transition 시간을 최소화한다.
- ConceptReference는 hover에만 의존하지 않고 focus, click, tap으로 같은 미리보기를 연다.
- canvas renderer의 virtual anchor도 keyboard 순서와 screen reader 이름을 가진 DOM control을 제공한다.

## 8. 완료 기준

- 두 theme가 component markup 변경 없이 token 교체만으로 동작한다.
- 일반 UI와 Canvas component를 외부 app에서 import할 수 있다.
- selection, node drag, canvas pan, cursor zoom, keyboard nudge, child detail이 catalog에서 실제 동작한다.
- automatic cluster suggestion이 같은 입력에서 stable ID를 만들고 하위 노드를 부모 묶음에 포함한다.
- build, type check, unit test와 실제 browser interaction 검증이 통과한다.
- DOM, SVG, canvas virtual anchor가 같은 ConceptPreview를 열고 어떤 overflow container에도 잘리지 않는다.
- 화면의 안내 문구를 제거해도 참조·상세·이동 조작의 발견 가능성과 결과가 유지된다.
- 대표 시안은 실제 학습 가능한 설명과 단순 직선보다 복잡한 노드 관계를 포함한다.

## 9. 검증 기록

2026-07-31에 Jamserver 공개 주소의 실제 Chromium에서 다음 항목을 확인했다.

- 1024×768, 1280×900, 1440×900에서 Paper·Midnight 두 테마를 확인했다.
- 390×844에서 페이지 가로 넘침 없이 모바일 레이아웃과 캔버스 이동이 유지되는지 확인했다.
- 60% 자동 묶음, 100% 개별 노드, 140% 확대 상태에서 노드·묶음 겹침과 콘텐츠 잘림이 없었다.
- 모든 연결선 끝점이 실제 노드 경계에 0px 오차로 붙었다.
- 노드 실제 드래그, 캔버스 실제 이동, 확대·축소, 화살표 키 8px 이동을 확인했다.
- npm 상세 보기를 click과 Enter로 열고, 닫기 버튼과 Escape로 닫았다.
- 상세 패널의 중심 보기는 부모 Node.js를 선택하고 110%로 맞춘 뒤 패널을 닫았다.
- 하위 노드 버튼을 누른 뒤 부모 위치가 바뀌지 않아 gesture 차단이 유지됐다.
- 이동 도구가 켜진 상태에서도 자동 묶음의 펼쳐 보기와 검토 action이 동작했다.
- browser console error와 page error는 없었다.

자동 묶음의 첫 배치에서 카드 겹침을 발견해, 가까운 노드를 번갈아 넣는 방식 대신
화면상 멀리 떨어진 seed에 거리·연결 비용이 가장 낮은 노드를 할당하도록 수정했다.
수정 후 두 묶음의 겹침 면적은 Paper·Midnight 모두 0이었다.

2026-08-02에는 실제 학습 콘텐츠로 확장한 통합 시안을 다시 검증했다.

- 1024×768, 1280×900, 1440×900의 Paper·Midnight에서 8개 노드와 연결선이 겹치거나 canvas 경계를 벗어나지 않았다.
- 60% 자동 묶음과 140% 상세 보기에서도 카드 겹침, 잘림, 페이지 가로 넘침이 없었다.
- DOM 본문과 그래프 노드의 개념 참조 모두 점선 밑줄을 사용하고, 전역 ConceptPreview가 anchor에서 8px 떨어진 위치에 열렸다.
- ConceptPreview는 phone·canvas·node 경계를 넘어 표시됐고 viewport 안에 유지됐다. `Escape`로 닫은 뒤 focus가 원래 참조로 돌아왔다.
- 390×844 Viewer에서 페이지 가로 넘침이 없었고 phone 전체가 viewport 폭 안에 들어왔다.
- 안에 담기·주변에 펼치기·필요할 때 열기·하위 구조 집중의 Viewer 표현을 확인했다. 하위 상세와 popup은 실제로 열고 닫았다.
- Editor에서 설명 부품을 Node.js로 실제 drag해 추가한 뒤에도 노드 겹침과 canvas 경계 이탈이 없었다.
- 검증한 모든 상태에서 browser console error가 없었다.
