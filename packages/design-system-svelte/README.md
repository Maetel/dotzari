# @dotzari/design-system-svelte

Dotzari 강의·노드 캔버스를 Svelte 앱에서 사용하는 컴포넌트 패키지다. 현재 패키지명과
버전은 workspace 구현 이름이며 외부 registry 이름은 아직 확정하지 않았다.

## 사용

앱 진입점에서 공통 token과 기본 스타일을 한 번 불러온다.

```ts
import '@dotzari/design-system/tokens.css';
import '@dotzari/design-system/base.css';
```

강의 데이터와 Viewer를 연결한다.

```svelte
<script lang="ts">
  import type { Lesson } from '@dotzari/design-system';
  import { LessonViewer } from '@dotzari/design-system-svelte';

  let { lesson }: { lesson: Lesson } = $props();
  let stepId = $state(lesson.chapters[0].stepIds[0]);
</script>

<div class="dz-root" data-dz-theme="paper">
  <LessonViewer {lesson} bind:stepId />
</div>
```

`openContentNodeId`를 양방향으로 연결하면 앱의 주소나 자체 상태에서 긴 콘텐츠 보기를
직접 열고 닫을 수 있다.

앱이 준비해야 하는 것은 `Lesson` 데이터다. 현재 스텝의 노드·연결 계산, 실제 노드 높이를
사용한 배치, 챕터 경계, 확대·축소와 드래그는 패키지가 담당한다.

## 주요 component

- `LessonViewer`: 학습 화면 전체 조합
- `LessonProgress`: 챕터·스텝 통합 인디케이터
- `LessonCanvas`: 읽기 전용 학습 캔버스
- `LessonNodeCard`: 풍부한 노드 콘텐츠
- `CodeContentViewer`: 긴 코드 전용 보기
- `CanvasSurface`: 제작 화면용 범용 캔버스

전체 더미데이터 예제는 `apps/design-system-demo/src/demoLesson.ts`, 실제 사용 화면은
`apps/design-system-demo/src/App.svelte`에서 확인할 수 있다.
