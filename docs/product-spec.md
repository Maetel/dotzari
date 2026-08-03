# Dotzari 제품·아키텍처 SSOT

- **문서 상태:** 논의 중인 현행 기준선
- **최종 갱신일:** 2026-08-03
- **대상 독자:** 제품 논의 참여자, 코딩 에이전트, 라이브러리 개발자, 아키텍트
- **주요 언어:** TypeScript
- **현재 고려 프레임워크:** React, Svelte
- **문서 목적:** 제품 의도, 범위, 설계 결정, 미결정 사항, 구현 완료 조건을 한곳에서 관리한다.

이 문서는 Dotzari의 제품 및 구현에 관한 단일 진실 공급원(SSOT)이다. 아래 본문은
`cross-framework-animated-diagram-agent-spec.md`를 초기 기준선으로 가져온 것이다.
이후 사용자와 에이전트의 논의에서 합의된 내용은 이 문서에 반영되어야 하며, 다른
문서나 기존 코드가 이 문서와 충돌하면 명시적으로 개정되기 전까지 이 문서를 따른다.

## 문서 운영 규칙

1. 제품 범위나 동작, 데이터 모델, 아키텍처, 우선순위에 관한 논의를 구현보다 먼저 이 문서에 반영한다.
2. 합의된 변경은 관련 본문과 아래 결정 기록을 함께 갱신한다.
3. 아직 합의되지 않은 사항은 미결정 사항으로 남기고, 구현으로 임의 확정하지 않는다.
4. 미결정 사항과 직접 관계없는 현행 본문은 구현의 기준으로 사용할 수 있다.
5. 코드, 테스트, README, 예제는 이 문서와 일치해야 한다.
6. 결정이 번복되면 이전 기록을 삭제하지 않고 새 기록에서 대체된 결정과 이유를 남긴다.

## 현재 미결정 사항

| ID | 질문 | 상태 |
| --- | --- | --- |
| Q-003 | 노드 콘텐츠·스타일·위치 변경을 현재 Scene, 이후 Scene, 전체 Scene에 전파하는 정확한 편집 의미론은 무엇인가? | 논의 필요 |
| Q-004 | MVP가 제공할 편집 UI의 세부 경계는 어디까지인가? | 공식 Svelte 데모 포함은 확정, 세부 기능은 논의 필요 |
| Q-005 | 패키지명, 지원 런타임·브라우저·프레임워크 버전의 호환성 기준은 무엇인가? | 구현 착수 전 결정 |
| Q-007 | 재사용 개념 에셋을 수정할 때 과거 강의에 자동 반영할지, 버전을 고정할지, 선택하게 할지? | 논의 필요 |
| Q-008 | 음성·영상은 노드 콘텐츠, 프레임 사이 설명 트랙, 전체 강의 트랙 중 어디에 연결할 수 있어야 하는가? | 논의 필요 |
| Q-009 | 프로젝트·강의·슬라이드·단계의 저장 및 배포 경계는 무엇인가? | 데이터 모델 논의 필요 |
| Q-010 | 개념 참조, 미리보기, 원 강의 이동, 개념 그래프 탐색 중 어디까지를 첫 MVP에 포함할 것인가? | 우선순위 논의 필요 |
| Q-011 | 단계는 전체 슬라이드 상태의 snapshot인가, 사용자가 지정한 animation cue의 집합인가, 또는 둘을 결합하는가? | 논의 필요 |
| Q-012 | 데스크톱에서 제작한 슬라이드를 모바일 Viewer에서 축소·이동, 자동 재배치, 제작자 지정 모바일 레이아웃 중 어떤 방식으로 표현할 것인가? | 다음 논의 대상 |
| Q-013 | 모바일 Viewer의 기본 진행 방식은 탭 기반 이전·다음, 세로 스크롤, 자동 재생 중 무엇이며 어떻게 조합하는가? | 논의 필요 |
| Q-014 | 자동 묶음이 위치, 연결 관계, 부모·자식 관계, 노드 내용 중 각 신호를 어떤 비중으로 사용하며, 줌 임계값·결과 안정성·제작자 수정 이후 재계산 규칙을 어떻게 정할 것인가? | 자동 제안 원칙은 확정, 세부 알고리즘은 검증 필요 |
| Q-015 | 하위 노드의 기본 표현 방식을 노드 수·깊이·기기·설명 단계·제작자 지정 중 무엇으로 결정하고, 화면 조건에 따라 자동 전환할 것인가? | 디자인 탐색 후 결정 |

## 결정 기록

| 날짜 | ID | 결정 | 이유 |
| --- | --- | --- | --- |
| 2026-07-27 | D-001 | 이 문서를 제품·아키텍처·구현 범위의 SSOT로 사용한다. | 대화에서 구체화되는 요구와 구현 기준을 한곳에 유지하기 위해서다. |
| 2026-07-27 | D-002 | 첨부된 초기 구현 사양 전체를 현행 기준선으로 가져온다. | 기존 구상을 잃지 않고, 이후 논의에서 항목별로 검토·수정하기 위해서다. |
| 2026-07-27 | D-003 | 핵심 산출물은 UI와 코어 로직을 제공하는 재사용 라이브러리이며, 이를 실제로 사용하고 검증하는 공식 데모 페이지를 함께 개발한다. | 재사용성과 실제 저작·재생 경험 검증을 동시에 확보하기 위해서다. |
| 2026-07-27 | D-004 | 첫 renderer와 공식 데모는 Svelte를 우선한다. React adapter는 공통 코어와 Svelte vertical slice 이후에 개발한다. | 현재의 주 개발 환경과 빠른 제품 검증에 집중하기 위해서다. |
| 2026-07-27 | D-005 | 대표 사용처는 영상 편집 지식이 없어도 PowerPoint를 만들듯 도형과 개념을 연결하여 생각을 명확히 전달할 수 있는 인터랙티브 강의·설명 콘텐츠 제작이다. | 영상 제작의 학습 비용을 낮추면서 설명력과 상호작용성을 높이기 위해서다. |
| 2026-07-27 | D-006 | 개념을 설명하는 노드는 강의 간 재사용 가능한 에셋이 될 수 있으며, 본문의 개념 참조에서 미리보기·원 설명 이동·관련 개념 탐색을 지원하는 방향으로 설계한다. | 학습자가 현재 맥락을 벗어나지 않고 선행 개념을 복습하고 지식 관계를 따라갈 수 있게 하기 위해서다. |
| 2026-07-27 | D-007 | 음성과 영상은 도형·개념·애니메이션을 보충하는 선택적 설명 매체로 지원한다. | 시각적 설명을 중심에 두면서 필요한 경우 기존 강의 매체의 표현력을 결합하기 위해서다. |
| 2026-07-27 | D-008 | 사용자에게 노출하는 콘텐츠 계층은 `강의 → 슬라이드 → 단계`로 부른다. 슬라이드는 긴밀하게 연결된 여러 상태의 설명 단위이고, 단계는 슬라이드 안의 개별 표현 상태다. `keyframe`은 저수준 애니메이션 엔진 용어로만 사용한다. | PowerPoint·Keynote 사용자에게 친숙한 mental model을 제공하고 제품 용어와 애니메이션 용어의 충돌을 피하기 위해서다. |
| 2026-07-27 | D-009 | 최종 사용자는 제작자와 소비자로 구분한다. 제작자는 데스크톱 우선 Editor에서 콘텐츠를 만들고, 소비자는 모바일 우선 Viewer에서 콘텐츠를 재생하고 탐색한다. | 두 사용자의 핵심 과업과 주 사용 기기가 다르므로 각각에 맞는 경험을 설계하기 위해서다. |
| 2026-07-27 | D-010 | Editor와 Viewer는 동일한 document model과 timeline/player semantics를 공유하되 독립적인 UI surface와 배포 진입점을 제공한다. Viewer는 Editor 전체에 의존하지 않아야 한다. | 모바일 Viewer의 번들 크기, 사용성, 성능을 편집 기능과 독립적으로 최적화하기 위해서다. |
| 2026-07-31 | D-011 | 2차 Editor 디자인 탐색은 1차의 Slide Studio와 Concept Atlas를 결합하고, Slide + Concept·Concept Dock·Narrative Rail의 세 가지 정보 구조로 비교한다. 각 시안은 Paper와 Midnight 두 테마를 동일하게 제공한다. | PowerPoint형 저작의 친숙함과 개념 에셋의 재사용 가치를 함께 검증하면서, 시각 취향과 정보 구조의 차이를 분리해 판단하기 위해서다. |
| 2026-07-31 | D-012 | D-011의 세 정보 구조를 대안으로 나누지 않고 하나의 Editor에 합친다. 왼쪽은 슬라이드 구성, 오른쪽은 개념 검색·재사용, 아래는 설명 순서·내레이션·애니메이션을 담당하며 Paper와 Midnight 두 테마를 유지한다. 캔버스 연결선은 고정 좌표가 아니라 실제 노드 경계에서 계산한다. | 제작 과정에서 세 기능이 동시에 필요하며, 고정 퍼센트·회전값으로 그린 연결선은 화면과 글꼴에 따라 어긋났기 때문이다. |
| 2026-07-31 | D-013 | 통합 시안은 핵심 개념 설명, 선행 개념 복습, 과정·데이터 흐름, 미디어 보충 설명, 복습·이해 확인의 다섯 대표 시나리오를 다룬다. 각 시나리오는 서로 다른 시안이 아니라 동일한 강의 데이터에 연결된 제작 화면과 학습 화면을 함께 보여 준다. | 다양한 설명 방식에서도 Editor와 Viewer가 같은 문서 모델을 공유하면서 각 사용자에게 맞는 과업과 화면을 제공하는지 검증하기 위해서다. |
| 2026-07-31 | D-014 | 디자인 탐색은 텍스트 카드 외에 이미지·영상, 부모 안의 하위 노드, 긴 용어 설명과 여러 예시, 코드 블록을 담는 노드를 함께 다룬다. 줌을 축소하면 관련 노드를 묶음으로 요약하고 확대하면 상세 콘텐츠를 펼치는 시맨틱 줌을 실험하되, 묶음은 문서 구조를 파괴하지 않는 계산된 화면 상태로 표현한다. | 설명 내용에 따라 필요한 노드의 형태가 다르고, 정보량이 많은 그래프를 한눈에 보거나 세부 내용을 읽는 과업을 같은 캔버스에서 지원해야 하기 때문이다. 정확한 묶음 규칙과 임계값은 Q-014에서 결정한다. |
| 2026-07-31 | D-015 | 하위 노드의 의미상 소속과 화면 표현을 분리한다. 같은 하위 노드 데이터를 부모 안에 담기, 주변에 펼치기, hover·키보드 초점·click·tap으로 열기, 하위 구조에 집중하기, 단계별로 등장시키기, 요약 후 펼치기 중 설명 맥락에 맞는 방식으로 보여 줄 수 있어야 한다. Editor에서는 설명·하위 노드·이미지·코드·예시 같은 부품을 부모에 끌어다 놓거나 click·keyboard로 추가한 뒤 표현 방식과 등장 단계를 정한다. | 하나의 고정 배치는 하위 노드 수, 설명 목적, 화면 크기에 모두 대응하기 어렵다. 콘텐츠를 한 번만 만들고도 제작자 의도와 학습자 기기에 맞는 표현으로 바꾸기 위해서다. 기본 선택과 자동 전환 규칙은 Q-015에서 결정한다. |
| 2026-07-31 | D-016 | 부모 안에 표시된 하위 노드는 단순한 이름표가 아니라 더 볼 수 있는 항목임을 문구와 방향 표시로 드러낸다. 제작 화면과 학습 화면 모두에서 click·tap·keyboard로 역할, 설명, 예시를 열고 닫을 수 있어야 하며, 부모 경로를 유지한 채 하위 구조 집중 보기로 이동할 수 있어야 한다. | 하위 노드의 존재만 보여 주고 여는 방법을 알리지 않으면 학습자가 추가 내용을 발견할 수 없기 때문이다. hover는 보조 수단으로만 사용한다. |
| 2026-07-31 | D-017 | 제작자가 줌 단계별 묶음을 미리 전부 만들도록 요구하지 않는다. 웹앱이 노드 위치, 연결 관계, 부모·자식 관계, 노드 내용을 바탕으로 축소 시 묶음과 이름을 먼저 제안한다. 제작자는 제안된 이름과 포함 노드를 그대로 사용하거나 수정하고, 확대하여 원래 노드의 강조 상태에서 구성을 확인한다. 자동 제안은 계산된 화면 상태로 유지하고 제작자가 확정하거나 수정한 부분만 문서에 덮어쓴 값으로 저장한다. | 노드 수가 늘어날수록 수동 묶음 관리 비용이 커지고, 제작 과정에서 줌 단계마다 같은 구조를 반복 편집하게 되기 때문이다. 세부 점수와 재계산 규칙은 Q-014에서 결정한다. |
| 2026-07-31 | D-018 | 디자인 시스템은 `semantic token과 일반 UI`, `캔버스 전용 컴포넌트`, `프레임워크 비종속 인터랙션·기하 로직`의 세 층으로 만든다. Svelte 컴포넌트를 먼저 제공하되 선택·hover·drag·pan·zoom·상세 열기·자동 묶음 전환 같은 캔버스 동작은 공통 상태와 event 규칙으로 관리한다. Paper와 Midnight는 컴포넌트별 색상 복제가 아니라 같은 semantic token의 theme 값으로 구현한다. | 캔버스의 모양만 통일하고 동작을 화면마다 따로 구현하면 Editor와 Viewer의 상태 의미, 접근성, gesture 우선순위가 달라지기 때문이다. 내부 작업 패키지 이름은 Q-005가 확정될 때까지 public API가 아니다. |
| 2026-08-02 | D-019 | 조작 방법과 상태 유지 여부를 반복 설명하는 문장으로 affordance를 대신하지 않는다. 개념 참조는 글자 가까이에 점선 밑줄로 표시하고, 미리보기는 DOM·SVG·canvas 구현과 무관하게 활성화한 내용 바로 옆의 전역 overlay에 같은 디자인으로 연다. 디자인 탐색은 단어 나열이 아니라 실제 학습 가능한 내용과 대표적인 노드·관계 복잡도를 사용한다. | 제품 설명을 읽어야만 조작할 수 있는 화면은 공간을 낭비하고 상호작용 자체의 발견 가능성을 검증하지 못한다. 얕은 예시 역시 정보 밀도, 계층, overlay 배치, 모바일 적응성이 실제 콘텐츠에서도 유지되는지 판단할 수 없게 한다. |
| 2026-08-03 | D-020 | 학습자에게 보이는 콘텐츠 계층을 `강의 → 챕터 → 스텝`으로 정하고 D-008의 `슬라이드`를 `챕터`로 대체한다. 챕터는 책의 장처럼 의미가 이어지는 여러 스텝의 묶음이며, Viewer의 챕터 제목과 스텝 진행 정보는 하나의 인디케이터로 제공한다. 첫 구현은 프레임워크 비종속 코어, Svelte Viewer 컴포넌트, 24개 노드 더미데이터를 사용하는 공식 데모의 순서로 진행한다. | 학습자가 전체 설명의 큰 단위와 현재 진행 위치를 함께 이해해야 하며, 잘 보이는 Viewer 구조를 먼저 확정한 뒤 같은 모델을 편집하는 Editor를 설계하기 위해서다. |
| 2026-08-03 | D-021 | 모바일과 데스크톱 Viewer는 같은 절대 월드 좌표를 사용한다. 카메라는 실제 캔버스 element의 viewport 크기와 측정이 끝난 현재 스텝 노드 경계로 계산하며, 스텝 번호·문서 폭·기기 화면 폭으로 위치를 추정하지 않는다. 드래그 차이는 viewport px로 scroll offset에 직접 반영하고 pointer up 뒤 스냅·관성·지연된 자동 이동을 실행하지 않는다. | 모바일에서 월드·확대된 스크롤·페이지 좌표를 섞으면 직접 진입과 스텝 전환 때 현재 열이 화면 밖으로 밀리고, 드래그 뒤 카메라가 다시 움직이는 회귀가 발생하기 때문이다. |

## 디자인 탐색 자료

- [다섯 시나리오 기반 통합 Editor·Viewer 탐색](./design-explorations/index.html)
- [2차 디자인 탐색 3안](./design-explorations/iteration-2.html)
- [1차 디자인 탐색 5안](./design-explorations/five-directions.html)
- [디자인 탐색 설명](./design-explorations/README.md)

현재 통합 시안은 비교와 논의를 위한 비규범적 자료다. D-012에 따라 슬라이드 구성, 개념
검색·재사용, 설명 레일을 한 Editor에 배치하고, D-013에 따라 같은 콘텐츠의 제작 화면과
모바일 우선 학습 화면을 시나리오별로 함께 확인한다. D-014에 따라 풍부한 노드 형태와
줌 수준별 묶음·상세 표현을, D-015와 D-016에 따라 하위 노드 표현·상세 탐색·조합 방식을 함께 실험한다. D-017에 따라 축소 상태의 묶음은 앱의 자동 제안과 제작자 검토 흐름으로 다룬다. 두 테마는 현행 탐색 기준으로 유지한다.
세부 패널 크기, 스타일, 인터랙션은 추가 논의를 거쳐 제품 기준으로 확정한다.

### 대표 시나리오와 양쪽 사용자 과업

| 시나리오 | 제작자가 Editor에서 하는 일 | 학습자가 Viewer에서 하는 일 |
| --- | --- | --- |
| 핵심 개념 설명 | 개념 노드와 관계를 배치하고 단계별 등장 순서를 정한다. | 한 번에 하나씩 드러나는 관계를 앞뒤로 이동하며 이해한다. |
| 선행 개념 복습 | 본문 용어에 기존 개념 에셋, 미리보기, 원 설명 이동을 연결한다. | 현재 맥락을 유지한 채 용어를 잠깐 확인하고 필요하면 원 강의로 이동한다. |
| 과정·데이터 흐름 | 데이터의 방향과 연결선 강조 타이밍을 편집한다. | 현재 이동 중인 요청과 응답 경로를 단계별로 따라간다. |
| 미디어 보충 설명 | 도형 설명에 짧은 음성·영상·자막의 시작점을 맞춘다. | 다이어그램 맥락을 유지하며 필요한 보충 설명을 재생한다. |
| 복습·이해 확인 | 질문, 선택지, 피드백과 복습 경로를 연결한다. | 답을 고르고 이유가 포함된 피드백을 본 뒤 필요한 개념으로 돌아간다. |

### 풍부한 노드와 시맨틱 줌 탐색

- 노드는 짧은 텍스트 카드에 한정하지 않고 이미지, 영상, 코드 블록, 긴 정의와 예시 목록을 담을 수 있어야 한다.
- 부모 노드는 npm처럼 의미상 소속된 하위 노드를 안에 포함해 계층을 표현할 수 있어야 하며, 각 하위 노드는 상세 내용을 열 수 있다는 사실을 스스로 드러내야 한다.
- 현행 시안은 60%에서 연관 노드 묶음, 100%에서 개별 노드, 140%에서 상세 콘텐츠를 보여 주는 세 단계를 비교한다.
- 축소 상태의 묶음은 원래 노드의 정체성과 문서 데이터를 합치거나 삭제하지 않는 계산된 render state다.
- 제작자는 묶음을 미리 만들 필요가 없다. 앱이 먼저 제안하고 제작자는 이름과 포함 노드를 검토·수정한다.
- 제작자가 확정한 이름과 구성만 자동 제안 위에 적용할 덮어쓴 값으로 저장한다. 세부 신호와 실제 줌 임계값은 Q-014의 미결정 사항이며 현행 수치는 디자인 검증용이다.

### 하위 노드 표현과 Editor 조합 방식 탐색

하위 노드는 부모와의 의미 관계를 유지하되, 항상 부모 카드 안에 그릴 필요는 없다. 현행
탐색은 다음 표현을 서로 배타적인 데이터 구조가 아닌 교체 가능한 화면 정책으로 다룬다.

| 표현 방식 | 적합한 상황 | 학습자 경험과 주의점 |
| --- | --- | --- |
| 부모 안에 담기 | 하위 노드가 적고 소속 관계가 가장 중요할 때 | 한눈에 소속을 읽기 쉽다. 내용이 많아지면 부모가 지나치게 커질 수 있다. |
| 주변에 펼치기 | 형제 노드를 비교하거나 각각의 연결 관계를 보여 줄 때 | 공간 관계를 직접 볼 수 있다. 자동 배치와 겹침 방지가 필요하다. |
| 필요할 때 열기 | 보충 정보이며 현재 화면 밀도를 낮춰야 할 때 | 데스크톱에서는 hover·focus로 미리 보고 click으로 고정한다. 모바일에서는 tap으로 열며 hover에만 의존하지 않는다. |
| 하위 구조에 집중하기 | 깊이가 있거나 작은 화면에서 세부 구조를 읽을 때 | 상위 맥락을 경로로 남기고 하위 구조만 크게 본다. 뒤로 가기로 원래 위치에 복귀할 수 있어야 한다. |
| 단계별로 등장시키기 | 발표자의 설명 순서 자체가 관계 이해에 중요할 때 | 설명 레일에 맞춰 필요한 하위 노드만 순차적으로 나타난다. 이전 단계로 돌아가 같은 흐름을 다시 볼 수 있어야 한다. |
| 요약 후 펼치기 | 하위 노드가 많아 전체를 바로 보여 주기 어려울 때 | `도구 6개` 같은 요약을 먼저 보여 주고, 펼치면 목록·묶음·별도 화면으로 전환한다. |

부모 안에 담는 방식에서도 하위 노드는 이름만 적힌 장식처럼 보여서는 안 된다. `자세히
보기` 문구나 방향 표시를 함께 두고, click·tap·keyboard로 상세 설명과 예시를 연다. 상세
화면은 `Node.js / npm`처럼 부모 경로를 유지하고, 닫기와 하위 구조 집중 이동을 함께 제공한다.

Editor의 기본 저작 흐름은 콘텐츠 구성과 표현 설정을 분리한다.

1. 제작자는 설명 문단, 하위 노드, 이미지, 코드 블록, 예시 목록을 부품 목록에서 부모 노드로 끌어다 놓는다.
2. 끌어다 놓기 어려운 경우 같은 부품을 click 또는 keyboard로 추가할 수 있어야 한다.
3. 부모의 구성 목록에서 부품을 재정렬·삭제하고, 하위 노드의 이름·내용·관계를 편집한다.
4. 하위 노드 표현 방식과 모바일 대체 표현을 고르고, 필요하면 자동 배치 결과를 직접 조정한다.
5. 설명 레일에서 각 하위 노드가 나타나거나 열릴 단계를 지정하고 Editor 안에서 Viewer 결과를 미리 본다.

현재 HTML 탐색은 다섯 부품의 끌어다 놓기·click 추가와 삭제, 그리고 안에 담기·주변에
펼치기·필요할 때 열기·하위 구조 집중의 네 화면 정책을 구현한다. 단계별 등장과 요약 후
펼치기는 현행 타임라인·시맨틱 줌과 결합할 후보이며, 기본값과 자동 전환 규칙은 Q-015에 남긴다.
부모 안의 npm·npx는 상세 카드와 예시를 열고 하위 구조 집중 보기로 이동할 수 있다.

### 자동 묶음 제안과 제작자 검토 흐름

1. 제작자는 평소처럼 노드를 만들고 관계를 연결한다. 줌 수준별 묶음을 미리 만들 필요는 없다.
2. 축소 시 앱이 위치, 연결선, 부모·자식 관계, 노드 내용을 함께 살펴 적절한 단위의 묶음과 이름을 제안한다.
3. 제안된 묶음은 점선 경계와 `앱이 제안한 묶음` 문구로 아직 검토 가능한 상태임을 알린다.
4. 제작자는 오른쪽 패널에서 묶음 이름을 바꾸고 포함할 노드를 추가하거나 뺀다.
5. `확대해서 원래 노드에서 확인`을 선택하면 해당 노드만 강조하여 묶음 구성을 공간 맥락에서 확인한다.
6. 수정하지 않은 부분은 노드 변화에 맞춰 다시 계산하고, 제작자가 확정한 이름과 구성은 저장된 덮어쓴 값으로 우선 적용한다.

자동 묶음은 노드 생성과 별개의 필수 선행 작업이 아니라 시맨틱 줌 과정에서 제공되는
저작 보조 기능이다. 앱은 우선 쓸 만한 결과를 만들고, 확신이 낮거나 여러 해석이 가능한
경우에만 제작자에게 이름과 구성을 확인하도록 유도한다.

### 디자인 시스템 구현 기준

디자인 시스템은 화면 예시를 모아 둔 문서가 아니라 제품 코드가 직접 사용하는 패키지다.

1. **Foundation:** 색, 글자, 간격, radius, 그림자, motion, layer를 semantic token으로 제공한다.
2. **일반 UI:** Button, IconButton, Badge, SegmentedControl, Field, Panel처럼 캔버스 밖에서도 재사용하는 컴포넌트를 제공한다.
3. **Canvas UI:** CanvasSurface, CanvasNode, EdgeLayer, CanvasControls, ChildNodeTrigger, ClusterSuggestion처럼 다이어그램 문맥을 아는 컴포넌트를 제공한다.
4. **Interaction system:** 선택, hover, node drag, canvas pan, cursor 기준 zoom, keyboard nudge, 상세 열기, gesture 차단 영역을 event와 state transition으로 정의한다.
5. **검증 카탈로그:** 공식 Svelte 데모 안에서 token, component state, 실제 캔버스 동작을 함께 조작하고 확인할 수 있어야 한다.

컴포넌트는 `idle`, `hovered`, `focused`, `selected`, `dragging`, `disabled`, `readonly` 같은
상태를 명시적인 props와 `data-*` 상태로 노출한다. 색만으로 상태를 구분하지 않고 focus
ring, cursor, 문구, ARIA 상태를 함께 사용한다. 노드 안의 버튼·입력·링크에는 캔버스 drag를
막는 공통 표식을 사용하고, 이 표식의 의미와 gesture 우선순위도 디자인 시스템에 포함한다.

상세 컴포넌트 목록, token 이름, 상호작용 상태표와 사용 예시는
[`docs/design-system.md`](./design-system.md)를 구현 기준으로 사용한다.

### 디자인 탐색 화면 검증 기준

- 데스크톱 Editor 시안은 최소 1024×768, 1280×900, 1440×900에서 실제 브라우저로 확인한다.
- Paper와 Midnight 테마에서 패널 겹침, 잘림, 의도하지 않은 전체 페이지 가로 스크롤이 없어야 한다.
- 노드 연결선은 source·target의 측정된 경계에 닿아야 하며, 화면 크기와 테마를 바꾼 뒤에도 끝점 오차가 2 CSS px 이하여야 한다.
- 캔버스 노드, 연결선, 선택 강조, 슬라이드 목록, 개념 패널, 설명 레일을 스크린샷으로 함께 확인한다.
- 콘솔 오류와 빈 화면 여부를 확인한 뒤에만 디자인 탐색 체크포인트를 완료한다.
- 시나리오 기반 시안은 다섯 시나리오 각각에서 제작 화면과 학습 화면을 모두 확인한다.
- 풍부한 노드 시안은 60%, 100%, 140%에서 콘텐츠 잘림·노드 겹침·연결선 이탈이 없는지 확인하고, 축소 상태의 묶음과 확대 상태의 상세 정보가 의도대로 전환되는지 검증한다.
- 하위 노드 시안은 지원하는 모든 표현 방식에서 제작 화면과 학습 화면을 확인한다. 부품을 실제로 끌어다 놓고, click·keyboard 대체 조작과 팝업 열기·닫기, 부품 추가 뒤 노드 겹침과 연결선 위치도 함께 검증한다.
- 부모 안의 하위 노드는 상세 보기 가능 여부를 문구로 알리고, 제작 화면과 학습 화면에서 mouse·touch·keyboard로 상세 열기·닫기와 집중 보기 이동을 검증한다.
- 자동 묶음 시안은 미리 묶지 않은 노드에서 축소 시 제안이 생성되는지, 이름 저장·포함 노드 변경·원래 노드 강조 확인·다시 축소했을 때 수정 유지가 동작하는지 검증한다.

---

## 1. 프로젝트 정의

Dotzari는 UI와 프레임워크 비종속 코어 로직을 함께 제공하는 2D 노드 기반 다이어그램·프레젠테이션 라이브러리다. 타임라인을 가진 플로우차트형 에디터와 뷰어를 제공하며, Svelte renderer와 공식 데모 페이지를 먼저 개발한다. React renderer는 동일한 코어 위에 후속 제공한다.

### 1.1 핵심 산출물

1. **재사용 라이브러리**
   - 저장 가능한 document model, command, history, geometry, timeline을 담당하는 코어
   - 노드·엣지·viewport를 편집하고 재생하는 UI
   - Svelte 우선 native renderer와 후속 React native renderer

2. **공식 Svelte 데모·레퍼런스 앱**
   - 라이브러리의 실제 저작 및 재생 흐름을 지속적으로 사용하고 검증
   - 문서 조각을 나열하는 showcase가 아니라 작은 강의 하나를 만들고 재생할 수 있는 end-to-end 예제
   - 라이브러리 소비자가 참고할 수 있는 권장 통합 방식 제공

라이브러리는 다음 두 가지 모드를 동시에 지원해야 한다.

1. **편집 모드**
   - 개발자가 아닌 최종 사용자가 노드와 엣지를 생성, 이동, 수정, 삭제
   - 노드 배치와 연결 관계, 스타일 및 콘텐츠 편집
   - 카메라 위치와 줌 저장
   - 슬라이드와 단계 생성, 복제, 정렬 및 전환 설정

2. **재생 모드**
   - PowerPoint 슬라이드와 유사한 순서로 다이어그램 진행
   - 단계 전환 시 노드와 엣지의 생성, 이동, 변경, 삭제
   - 저장된 카메라 위치와 줌으로 자연스럽게 이동
   - 학습자가 개념 참조를 열고 이전 설명이나 관련 개념으로 이동할 수 있는 상호작용
   - 필요 시 세부 애니메이션 트랙으로 확장

### 1.2 사용자 유형, 제품 Surface 및 사용자 가치

최종 사용자 경험은 두 유형을 기준으로 설계한다. 이는 우선 제품 persona와 작업 흐름의 구분이며, 계정 권한 모델을 지금 확정한다는 뜻은 아니다.

#### 제작자(Producer)와 Editor

제작자는 설명하고 싶은 생각과 지식은 있지만 전문적인 영상 편집을 배우기 어려운 강의 제작자·발표자다. PowerPoint를 만들듯 도형과 개념을 배치하고 관계를 연결하여 자신의 생각을 명확히 전달할 수 있어야 한다.

Editor는 데스크톱 PC를 우선한다.

- 넓은 캔버스와 node palette, property inspector, slide/step sidebar를 동시에 활용
- 정밀한 mouse/pointer 조작과 keyboard shortcut 지원
- 다중 선택, drag, resize, 연결, 타임라인 편집에 높은 정보 밀도 허용
- 모바일 Editor는 첫 MVP의 필수 범위가 아님

#### 소비자(Consumer)와 Viewer

소비자는 제작된 강의·설명 콘텐츠를 보고, 듣고, 조작하며 학습하는 사람이다. Viewer는 모바일 경험을 우선하되 데스크톱에서도 동작해야 한다.

- 작은 화면과 touch 입력을 기준으로 읽기 쉬운 콘텐츠와 단순한 재생 조작 제공
- 단계 진행, 슬라이드 이동, 개념 미리보기, 원 설명 이동을 tap과 keyboard 모두로 지원
- hover에만 의존하지 않고 focus와 tap/click에 동일한 기능 제공
- 화면 방향, safe area, 브라우저 UI 변화와 다양한 viewport 크기 고려
- 편집 패널이나 편집 전용 상호작용을 포함하지 않는 read-only surface 제공

Editor와 Viewer는 동일한 강의·슬라이드·단계 데이터와 deterministic timeline 평가를 사용한다. 그러나 Viewer가 Editor 컴포넌트 전체를 import하거나 다운로드하도록 강제해서는 안 되며, 두 surface는 독립적으로 소비 가능한 진입점을 가져야 한다.

결과물은 단순히 재생되는 영상이 아니라 다음 특성을 가진 인터랙티브 설명 콘텐츠다.

- 도형, 텍스트, 이미지, 데이터, 개념 간 관계가 설명의 중심이 된다.
- 애니메이션은 내용을 화려하게 꾸미기보다 설명 순서와 인과관계를 드러내는 데 사용한다.
- 음성과 영상은 필요한 지점에 선택적으로 추가하여 설명을 보충한다.
- 소비자는 이전에 배운 개념을 현재 강의 안에서 미리 보거나 원 설명으로 이동해 복습할 수 있다.

### 1.3 콘텐츠 계층과 사용자 용어

사용자에게 노출하는 콘텐츠 계층은 책의 장과 단계 진행에 가까운 개념을 따른다.

- **강의(Lesson):** 하나의 학습 또는 발표 단위다. 여러 챕터로 구성된다.
- **챕터(Chapter):** 책의 장처럼 의미가 이어지는 여러 스텝을 묶는 설명 단위다. 챕터마다 제목, 요약, 정렬 순서와 소속 스텝을 가진다.
- **스텝(Step):** 챕터 안에서 한 번의 설명 진행 후 도달하는 개별 표현 상태다. 노드, 연결, viewport, 콘텐츠 상태를 포함한다.
- **단계 애니메이션:** 현재 단계에서 다음 단계로 진행할 때 발생하는 노드·엣지·카메라 변화다.
- **챕터 전환:** 현재 챕터의 마지막 스텝에서 다음 챕터의 첫 스텝으로 이동하는 전환이다.

저작 UI는 사용자가 챕터와 스텝을 다루도록 하고, `keyframe`이라는 단어를 노출하지 않는다. 저수준 엔진에서는 시간에 따른 개별 속성값을 나타내는 일반적인 애니메이션 keyframe 용어를 사용할 수 있다.

기존 초기 사양의 `Scene`은 현재 사용자 모델의 `Step`에 가장 가깝다. 새 구현은 `Chapter`와 그 안의 순서가 있는 스텝을 표현해야 하며, 본문에 남아 있는 `Slide`, `DiagramScene` 등의 이름은 D-020 이전의 초안으로 취급한다.

### 1.4 재사용 가능한 개념 에셋과 지식 그래프

노드는 용어에 대한 개념 자체, 데이터 덩어리, 이미지, 미디어 또는 일반적인 시각 요소를 표현할 수 있다. 그중 개념을 설명하는 노드는 특정 프레임에만 존재하는 도형을 넘어 강의 간 재사용 가능한 **개념 에셋(가칭)** 으로 취급할 수 있어야 한다.

예를 들어 1강에서 “프로그램” 개념 에셋을 만든 뒤, 2강에서 Node.js runtime을 설명하며 “프로그램”이라는 단어를 참조할 수 있다. 렌더러는 이 참조를 밑줄 등으로 구분하고 다음 상호작용을 제공할 수 있어야 한다.

- hover 또는 focus에서 개념 요약을 Tooltip이나 Popover로 미리 보기
- click 또는 키보드 조작으로 상세 개념 열기
- 해당 개념을 처음 또는 대표적으로 설명한 강의·프레임으로 이동
- 관련 개념을 연결한 그래프를 따라 탐색

개념 관계는 `npm → Node.js → 프로그램`처럼 체인 또는 그래프로 이어질 수 있다. 학습자는 강의를 듣는 도중 현재 설명에 필요한 선행 개념을 인터랙티브하게 복습할 수 있어야 한다.

개념 에셋의 재사용 가능한 정의와 각 강의·단계에서의 위치, 강조, 표시 상태는 분리한다. 구체적인 식별자, 버전, 변경 전파, 저장소 경계는 Q-007과 Q-009에서 결정한다. `ConceptAsset`, `ConceptReference` 같은 이름은 현재 개념 설명용 작업명이며 아직 public API 계약이 아니다.

본 프로젝트는 단순 그래프 시각화 라이브러리가 아니다. 최종 결과물은 다음에 가깝다.

> **노드 기반 설명·편집 엔진 + 프레젠테이션/타임라인 엔진 + 재사용 가능한 개념 그래프 + Svelte 우선 네이티브 렌더러와 공식 데모**

---

## 2. 핵심 요구사항

### 2.1 다이어그램 편집

필수 기능:

- 노드 생성, 선택, 다중 선택, 이동, 복제, 삭제
- 노드 리사이즈
- 노드 간 엣지 생성 및 삭제
- source/target handle 지원
- 박스 선택
- 캔버스 pan
- wheel/pinch zoom
- 줌 제한
- 그리드 스냅
- 선택적 정렬 가이드
- Undo/Redo
- 프로젝트 JSON 저장 및 복원
- 키보드 단축키
- 읽기 전용 모드
- 프레젠테이션 모드
- 축소 시 자동 묶음 제안과 제작자의 이름·구성 검토

### 2.2 커스텀 노드

노드는 일반 SVG 도형으로 제한하지 않는다.

React 사용자는 React 컴포넌트를 노드로 등록할 수 있어야 한다.

Svelte 사용자는 Svelte 컴포넌트를 노드로 등록할 수 있어야 한다.

노드 내부에서 다음 요소를 사용할 수 있어야 한다.

- 일반 HTML
- 이미지
- 리치 텍스트
- 링크
- 입력 필드
- 버튼
- 드롭다운
- Tooltip
- Popover
- Context menu
- 차트
- 비디오
- 앱의 디자인 시스템 컴포넌트
- 앱 전역 상태와의 연동

노드 데이터에는 HTML 문자열 자체보다 구조화된 데이터를 저장하는 것을 기본으로 한다.

```ts
interface ArticleNodeData {
  title: string;
  body: RichTextDocument;
  imageUrl?: string;
  annotations?: Annotation[];
}
```

실제 DOM 생성은 각 프레임워크의 노드 렌더러가 담당한다.

부모 안의 하위 노드는 구조화된 관계와 독립된 노드 정체성을 유지한다. 하위 노드를 여는
버튼은 캔버스의 선택·drag와 충돌하지 않아야 하며, Viewer에서도 같은 설명과 예시를
click·tap·keyboard로 열 수 있어야 한다.

### 2.3 슬라이드, 단계 및 타임라인

사용자가 편집하고 재생하는 최소 상태 단위는 `Step`이며, `Slide`는 순서가 있는 하나 이상의 Step을 묶는다. 현재 데이터 모델의 `Scene`은 Step에 대응하는 초기 이름이다.

각 Step은 다음 상태를 저장한다.

- 노드별 표현 상태
- 엣지별 표현 상태
- viewport
- 이전 또는 다음 단계와의 transition duration
- easing
- Step metadata

단계 애니메이션은 다음 변화를 지원해야 한다.

- 노드 등장
- 노드 퇴장
- 노드 위치 변경
- 노드 크기 변경
- 노드 opacity 변경
- 노드 콘텐츠 변경
- 노드 스타일 변경
- 엣지 등장/퇴장
- 엣지 endpoint 또는 스타일 변경
- 카메라 pan
- 카메라 zoom
- 카메라 pan과 zoom의 동시 애니메이션

Slide는 최소한 ordered step IDs와 slide metadata를 가져야 한다. 슬라이드 전환은 현재 슬라이드의 마지막 Step과 다음 슬라이드의 첫 Step 사이에서 평가한다. 단계의 정확한 저장 방식은 Q-011에서 결정한다.

향후 확장으로 Step 내부에 저수준 속성 keyframe track을 지원할 수 있어야 한다. 기존 `DiagramScene`, `SceneTransition`, `sceneOrder` 타입은 이 결정 이전의 초안이므로 구현 전에 Slide/Step 모델로 개정해야 한다.

### 2.4 카메라

최종 사용자가 다음을 수행할 수 있어야 한다.

- 현재 viewport를 Scene 카메라로 저장
- Scene별 viewport 수정
- fit selected
- fit all
- 특정 노드 중심으로 이동
- 줌 수치 직접 지정
- Scene 전환 시 duration 및 easing 지정
- 재생 중 수동 pan/zoom 허용 여부 설정
- 수동 조작 후 원래 타임라인으로 복귀

Viewport 모델:

```ts
interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
```

---

## 3. 아키텍처 원칙

### 3.1 프레임워크 비종속 코어

React Flow를 Svelte에서 감싸거나 Svelte Flow를 React에서 감싸지 않는다.

공통 코어는 다음을 import해서는 안 된다.

- React
- React DOM
- Svelte
- Svelte store
- JSX
- `.svelte` 컴포넌트
- 프레임워크 전용 이벤트 타입

코어는 순수 TypeScript로 구현한다.

### 3.2 네이티브 어댑터

React와 Svelte는 각각 네이티브 렌더러를 제공한다.

- React 노드는 React 컴포넌트
- Svelte 노드는 Svelte 컴포넌트
- 각 프레임워크의 Context, lifecycle, portal, reactive primitive 사용
- 두 어댑터의 개념적 API는 일치시키되 문법을 억지로 동일하게 만들지 않음

### 3.3 상태와 렌더링 분리

다음 세 계층을 구분한다.

1. **Document state**
   - 저장되는 영속 상태
   - 노드, 엣지, Scene, 타임라인, 사용자 설정

2. **Interaction state**
   - 선택
   - hover
   - drag session
   - connection preview
   - marquee selection
   - active tool

3. **Render state**
   - 현재 프레임에서 계산된 노드 위치
   - opacity
   - scale
   - viewport
   - 임시 애니메이션 값
   - 자동으로 계산한 축소 상태의 묶음 제안

영속 상태에 hover나 drag 중간값을 저장하지 않는다.
자동 묶음 제안 자체도 영속 상태에 복제하지 않으며, 제작자가 확정하거나 수정한 이름과
구성만 document state의 덮어쓴 값으로 저장한다.

### 3.4 Editor와 Viewer 경계

두 surface가 공유하는 계층:

- document schema와 serialization
- geometry와 viewport 계산
- timeline evaluation과 player state
- Svelte node/edge rendering primitive 중 read-only 재생에 필요한 부분

Editor 전용 계층:

- command dispatch를 사용하는 영속 상태 변경 UI
- selection, drag, resize, connection, history, inspector, authoring shortcut
- slide/step 생성 및 편집 도구

Viewer 전용 계층:

- read-only snapshot과 player controls
- touch 중심 단계·슬라이드 탐색
- concept reference preview와 navigation
- 소비자 상호작용을 위한 최소 interaction state

패키지는 Viewer가 Editor 전용 UI와 의존성을 포함하지 않는 별도 export path 또는 entrypoint를 제공해야 한다. 정확한 package/export 이름은 Q-005에서 결정한다.

### 3.5 명령 기반 변경

모든 영속 상태 변경은 Command를 통해 수행한다.

직접 배열을 수정하는 API를 public API로 제공하지 않는다.

목적:

- Undo/Redo
- transaction
- collaboration
- replay
- audit
- 테스트
- 자동 저장
- 타임라인 기록

---

## 4. 권장 모노레포 구조

```text
diagram-library/
├─ apps/
│  ├─ demo/                  # Svelte 기반 데스크톱 Editor·모바일 Viewer 데모
│  ├─ react-playground/      # 두 번째 renderer 개발·검증
│  └─ docs/
│
├─ packages/
│  ├─ core/
│  │  ├─ src/model/
│  │  ├─ src/commands/
│  │  ├─ src/store/
│  │  ├─ src/selection/
│  │  ├─ src/history/
│  │  └─ src/index.ts
│  │
│  ├─ geometry/
│  │  ├─ src/viewport/
│  │  ├─ src/hit-test/
│  │  ├─ src/edges/
│  │  ├─ src/spatial-index/
│  │  └─ src/index.ts
│  │
│  ├─ timeline/
│  │  ├─ src/model/
│  │  ├─ src/evaluate/
│  │  ├─ src/player/
│  │  ├─ src/easing/
│  │  └─ src/index.ts
│  │
│  ├─ renderer-dom/
│  │  ├─ src/pointer/
│  │  ├─ src/measure/
│  │  ├─ src/style-writer/
│  │  ├─ src/keyboard/
│  │  └─ src/index.ts
│  │
│  ├─ react/
│  │  ├─ src/components/
│  │  ├─ src/hooks/
│  │  ├─ src/context/
│  │  ├─ src/node-renderer/
│  │  └─ src/index.ts
│  │
│  ├─ svelte/
│  │  ├─ src/lib/components/
│  │  ├─ src/lib/context/
│  │  ├─ src/lib/actions/
│  │  ├─ src/lib/node-renderer/
│  │  └─ src/lib/index.ts
│  │
│  ├─ serialization/
│  │  ├─ src/schema/
│  │  ├─ src/migrations/
│  │  ├─ src/validation/
│  │  └─ src/index.ts
│  │
│  ├─ layout/
│  │  ├─ src/types.ts
│  │  ├─ src/dagre-adapter.ts
│  │  └─ src/elk-adapter.ts
│  │
│  ├─ design-system/         # semantic token, canvas interaction, geometry
│  ├─ design-system-svelte/  # Svelte 일반 UI와 canvas component
│  │
│  └─ collaboration/          # MVP 이후
│     ├─ src/yjs/
│     └─ src/index.ts
│
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
└─ vitest.workspace.ts
```

권장 패키지 이름:

```text
@project/diagram-core
@project/diagram-geometry
@project/diagram-timeline
@project/diagram-react
@project/diagram-svelte
@project/diagram-serialization
```

---

## 5. 핵심 데이터 모델

### 5.1 공통 타입

```ts
export interface XYPosition {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
```

### 5.2 노드

```ts
export interface DiagramNode<TData = unknown> {
  id: string;
  type: string;
  position: XYPosition;
  size?: Size;
  data: TData;

  parentId?: string;
  zIndex?: number;
  hidden?: boolean;
  locked?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  resizable?: boolean;

  style?: NodeStyle;
  metadata?: Record<string, unknown>;
}
```

`size`가 측정 전에는 없을 수 있다는 전제를 유지한다.

DOM 측정값과 사용자가 명시한 크기를 구분할 필요가 생기면 다음처럼 확장한다.

```ts
interface NodeDimensions {
  width: number;
  height: number;
  source: 'explicit' | 'measured';
}
```

### 5.3 Handle

```ts
export interface NodeHandle {
  id: string;
  nodeId: string;
  kind: 'source' | 'target' | 'bidirectional';
  position: 'top' | 'right' | 'bottom' | 'left' | 'custom';
  offset?: XYPosition;
  accepts?: string[];
  metadata?: Record<string, unknown>;
}
```

### 5.4 엣지

```ts
export interface DiagramEdge<TData = unknown> {
  id: string;
  type: string;

  sourceNodeId: string;
  sourceHandleId?: string;

  targetNodeId: string;
  targetHandleId?: string;

  data?: TData;
  label?: string;

  hidden?: boolean;
  selectable?: boolean;
  animated?: boolean;

  style?: EdgeStyle;
  metadata?: Record<string, unknown>;
}
```

### 5.5 프로젝트

```ts
export interface DiagramProject {
  schemaVersion: number;
  id: string;
  name: string;

  nodeDefinitions: Record<string, NodeDefinition>;
  edgeDefinitions: Record<string, EdgeDefinition>;

  scenes: Record<string, DiagramScene>;
  sceneOrder: string[];

  settings: ProjectSettings;
  metadata?: Record<string, unknown>;
}
```

### 5.6 노드의 정체성과 Scene 상태 분리

노드 콘텐츠의 기본값과 Scene별 표현값을 분리한다.

```ts
export interface NodeDefinition<TData = unknown> {
  id: string;
  type: string;
  data: TData;
  metadata?: Record<string, unknown>;
}

export interface SceneNodeState {
  nodeId: string;
  position: XYPosition;
  size?: Size;

  visible: boolean;
  opacity: number;
  scale: number;
  rotation?: number;
  zIndex?: number;

  dataOverride?: unknown;
  styleOverride?: Partial<NodeStyle>;
}
```

이 분리는 다음 편집 동작을 지원하기 위해 필수다.

- 모든 Scene에 반영되는 콘텐츠 수정
- 현재 Scene에만 반영되는 콘텐츠 override
- 이후 Scene에만 반영되는 수정
- Scene 복제
- 노드의 정체성 유지 상태에서 자연스러운 이동 애니메이션

### 5.7 Scene

```ts
export interface DiagramScene {
  id: string;
  name: string;
  durationMs: number;

  viewport: Viewport;

  nodes: Record<string, SceneNodeState>;
  edges: Record<string, SceneEdgeState>;

  transition: SceneTransition;
  metadata?: Record<string, unknown>;
}

export interface SceneTransition {
  durationMs: number;
  easing: EasingName;
  viewportInterpolation: 'linear' | 'smooth';
  nodeEnterPreset?: AnimationPreset;
  nodeExitPreset?: AnimationPreset;
}
```

### 5.8 애니메이션 속성 키프레임 확장 모델

이 절의 `Keyframe<T>`은 특정 시간의 속성 값을 뜻하는 저수준 애니메이션 엔진 용어다. 사용자에게 노출하는 슬라이드나 단계와는 다른 개념이며 저작 UI에서는 이 용어를 사용하지 않는다.

MVP에서는 Scene 전환만 구현한다. 단, 데이터 구조는 속성 키프레임을 나중에 추가할 수 있어야 한다.

```ts
export interface Keyframe<T> {
  timeMs: number;
  value: T;
  easing?: EasingName;
}

export interface NodeTrack {
  nodeId: string;
  position?: Keyframe<XYPosition>[];
  size?: Keyframe<Size>[];
  opacity?: Keyframe<number>[];
  scale?: Keyframe<number>[];
  rotation?: Keyframe<number>[];
  visible?: Keyframe<boolean>[];
  dataOverride?: Keyframe<unknown>[];
}

export interface ViewportTrack {
  viewport: Keyframe<Viewport>[];
}
```

---

## 6. 엔진 API

### 6.1 생성

```ts
const engine = createDiagramEngine({
  project,
  options: {
    minZoom: 0.1,
    maxZoom: 4,
    snapToGrid: true,
    gridSize: { x: 16, y: 16 },
  },
});
```

### 6.2 엔진 인터페이스

```ts
export interface DiagramEngine {
  getSnapshot(): DiagramSnapshot;
  subscribe(listener: DiagramListener): () => void;

  dispatch(command: DiagramCommand): CommandResult;
  transaction<T>(fn: () => T): T;

  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  loadProject(project: DiagramProject): void;
  exportProject(): DiagramProject;

  scene: SceneController;
  viewport: ViewportController;
  timeline: TimelineController;
}
```

### 6.3 Snapshot

```ts
export interface DiagramSnapshot {
  revision: number;
  project: DiagramProject;
  activeSceneId: string | null;

  interaction: InteractionState;
  computed: ComputedDiagramState;
}
```

외부 구독자는 snapshot을 직접 수정할 수 없어야 한다.

개발 모드에서는 `Object.freeze` 또는 readonly 타입을 활용한다.

---

## 7. Command 모델

### 7.1 기본 Command

```ts
export type DiagramCommand =
  | AddNodeCommand
  | UpdateNodeDataCommand
  | MoveNodesCommand
  | ResizeNodeCommand
  | RemoveNodesCommand
  | AddEdgeCommand
  | RemoveEdgesCommand
  | SetSelectionCommand
  | SetViewportCommand
  | AddSceneCommand
  | DuplicateSceneCommand
  | RemoveSceneCommand
  | ReorderScenesCommand
  | UpdateSceneCommand;
```

예:

```ts
export interface MoveNodesCommand {
  type: 'nodes.move';
  payload: {
    sceneId: string;
    positions: Record<string, XYPosition>;
  };
  meta?: CommandMetadata;
}
```

### 7.2 Transaction

드래그 중 매 pointer move를 history에 각각 기록하지 않는다.

권장 처리:

1. drag start에서 transaction 시작
2. drag 중 preview state 갱신
3. drag end에서 최종 위치 한 번 commit
4. 한 번의 Undo로 전체 드래그 취소

```ts
engine.transaction(() => {
  engine.dispatch({
    type: 'nodes.move',
    payload: {
      sceneId,
      positions,
    },
  });
});
```

### 7.3 Command 결과

```ts
export interface CommandResult {
  revision: number;
  changed: boolean;
  affectedNodeIds?: string[];
  affectedEdgeIds?: string[];
  warnings?: EngineWarning[];
}
```

---

## 8. Undo/Redo

Command 또는 patch 기반 history를 사용할 수 있다.

MVP 권장:

- 내부적으로 reversible patch 저장
- public API는 command 기반
- 연속 입력 병합 지원

병합 예:

- 텍스트 입력
- node drag
- resize
- viewport pan
- slider 변경

```ts
interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  forwardPatches: Patch[];
  inversePatches: Patch[];
  mergeKey?: string;
}
```

History에 저장하지 않을 상태:

- hover
- selection marquee 중간 좌표
- pointer position
- 애니메이션 중간 frame
- connection preview

---

## 9. Geometry 계층

### 9.1 좌표계

반드시 다음 좌표계를 구분한다.

1. **Viewport coordinates**
   - 상단 메뉴를 제외한 실제 캔버스 element 기준 픽셀 좌표

2. **Scroll coordinates**
   - zoom이 적용된 콘텐츠 픽셀 좌표

3. **Canvas 또는 world coordinates**
   - zoom 적용 전 다이어그램 절대 좌표

4. **Node-local coordinates**
   - 노드 내부 좌표

모바일 전용 월드 원점을 만들지 않는다. 카메라 변환은
`viewport = world × zoom − scroll`을 사용하며, 직접 스텝 주소로 진입한 최초 렌더에서도
viewport 연결과 노드 측정이 끝난 뒤 현재 스텝의 실제 경계로 계산한다. 상세 규칙과 회귀
검증 기준은 [`canvas-coordinate-system.md`](./canvas-coordinate-system.md)를 따른다.

공식 변환 함수:

```ts
export function screenToCanvas(
  point: XYPosition,
  viewport: Viewport,
  containerRect: DOMRectLike,
): XYPosition;

export function canvasToScreen(
  point: XYPosition,
  viewport: Viewport,
  containerRect: DOMRectLike,
): XYPosition;
```

변환 로직이 UI 컴포넌트 내부에 중복되지 않도록 한다.

### 9.2 Hit test

필수:

- point → node
- rectangle → nodes
- point → handle
- point → edge
- node bounds intersection
- viewport culling

노드 수가 증가하면 선형 탐색 대신 spatial index를 사용한다.

권장 추상화:

```ts
export interface SpatialIndex {
  insert(item: SpatialItem): void;
  update(item: SpatialItem): void;
  remove(id: string): void;
  search(bounds: Rect): SpatialItem[];
  point(point: XYPosition): SpatialItem[];
}
```

구현체는 추후 R-tree 등으로 교체 가능해야 한다.

### 9.3 Edge path

공통 geometry 패키지에서 path를 계산한다.

지원 우선순위:

1. straight
2. bezier
3. smooth step
4. orthogonal routing
5. custom router

```ts
export interface EdgePathResult {
  path: string;
  labelPosition: XYPosition;
  bounds: Rect;
}
```

---

## 10. 렌더링 전략

### 10.1 기본 구성

- 노드: HTML DOM
- 엣지: SVG
- 선택 박스와 guide: HTML 또는 SVG overlay
- background grid: CSS 또는 Canvas
- minimap: Canvas 또는 SVG

DOM 노드는 자유로운 HTML 콘텐츠 요구사항 때문에 필수다.

### 10.2 레이어

```text
DiagramRoot
├─ BackgroundLayer
├─ EdgeLayer
├─ NodeLayer
├─ SelectionLayer
├─ InteractionLayer
├─ OverlayLayer
└─ PortalLayer
```

권장 z-order:

```text
background < edges < nodes < selection < interaction < overlays
```

### 10.3 노드 위치

```css
.diagram-node {
  position: absolute;
  left: 0;
  top: 0;
  transform:
    translate3d(var(--node-x), var(--node-y), 0)
    scale(var(--node-scale));
  transform-origin: top left;
}
```

노드의 위치를 `left/top` 변경으로 애니메이션하지 않는다.

### 10.4 Viewport

노드와 엣지를 감싸는 공통 world layer에 viewport transform을 적용한다.

```css
.diagram-world {
  transform:
    translate3d(var(--viewport-x), var(--viewport-y), 0)
    scale(var(--viewport-zoom));
  transform-origin: 0 0;
}
```

### 10.5 고빈도 갱신

pointer move와 애니메이션 중 매 프레임 전체 React/Svelte 상태를 재생성하지 않는다.

권장 원칙:

- 영속 변경: framework reactive rendering
- 드래그 preview: 최소 범위 store 또는 imperative style write
- 애니메이션 frame: renderer-dom style writer
- 애니메이션 완료: core state에 최종값 commit

---

## 11. Timeline Engine

### 11.1 책임

Timeline Engine은 프레임워크와 무관하게 다음을 담당한다.

- Scene A와 Scene B 비교
- enter/update/exit 분류
- 시간에 따른 interpolation
- easing
- seek
- play/pause
- playback rate
- frame evaluation
- 최종 상태 commit

### 11.2 Scene diff

```ts
export interface SceneDiff {
  enteringNodes: string[];
  updatingNodes: string[];
  exitingNodes: string[];

  enteringEdges: string[];
  updatingEdges: string[];
  exitingEdges: string[];

  viewportChanged: boolean;
}
```

동일한 `nodeId`가 양쪽 Scene에 존재하면 update로 처리한다.

다른 ID의 노드는 형태가 같아도 자동 morph 대상으로 간주하지 않는다.

### 11.3 Frame 평가

```ts
export interface TimelineFrame {
  timeMs: number;
  progress: number;

  nodes: Record<string, AnimatedNodeState>;
  edges: Record<string, AnimatedEdgeState>;
  viewport: Viewport;
}
```

```ts
const frame = timeline.evaluate({
  fromScene,
  toScene,
  elapsedMs,
});
```

평가 함수는 가능한 한 순수 함수로 유지한다.

### 11.4 Player

```ts
export interface TimelinePlayer {
  play(): void;
  pause(): void;
  stop(): void;
  seek(timeMs: number): void;
  setPlaybackRate(rate: number): void;

  getState(): TimelinePlayerState;
  subscribe(listener: TimelineListener): () => void;
}
```

`requestAnimationFrame` clock과 deterministic evaluation을 분리한다.

테스트에서는 가상 clock을 주입할 수 있어야 한다.

```ts
interface AnimationClock {
  now(): number;
  request(callback: FrameRequestCallback): number;
  cancel(id: number): void;
}
```

### 11.5 Easing

초기 지원:

- linear
- ease
- ease-in
- ease-out
- ease-in-out
- cubic-bezier
- spring은 MVP 이후

```ts
type EasingFunction = (progress: number) => number;
```

### 11.6 Content 변경

텍스트 콘텐츠 전체를 문자 단위 morph하지 않는다.

기본 전략:

- 동일 노드 ID의 컨테이너 위치와 크기 interpolation
- 내부 콘텐츠는 crossfade
- 사용자 지정 renderer가 별도 전환을 제공할 수 있도록 hook 제공

```ts
interface NodeTransitionContext {
  previousData: unknown;
  nextData: unknown;
  progress: number;
  phase: 'enter' | 'update' | 'exit';
}
```

---

## 12. React Adapter

### 12.1 Public API 예시

```tsx
const engine = createDiagramEngine({ project });

const nodeTypes = {
  article: ArticleNode,
  image: ImageNode,
};

export function App() {
  return (
    <DiagramProvider engine={engine}>
      <DiagramCanvas nodeTypes={nodeTypes}>
        <DiagramBackground />
        <DiagramControls />
        <DiagramMiniMap />
      </DiagramCanvas>
    </DiagramProvider>
  );
}
```

### 12.2 주요 컴포넌트

```text
DiagramProvider
DiagramCanvas
DiagramNode
DiagramHandle
DiagramEdge
DiagramBackground
DiagramControls
DiagramMiniMap
NodeToolbar
NodeResizer
SelectionBox
ViewportPortal
```

### 12.3 Hooks

```ts
useDiagramEngine()
useDiagramSnapshot(selector)
useNodes()
useEdges()
useSelection()
useViewport()
useScene()
useTimeline()
useNode(nodeId)
```

Selector 기반 구독을 사용하여 불필요한 렌더링을 줄인다.

```ts
const position = useDiagramSnapshot(
  snapshot => snapshot.computed.nodes[nodeId].position,
);
```

---

## 13. Svelte Adapter

### 13.1 Public API 예시

```svelte
<script lang="ts">
  import {
    DiagramProvider,
    DiagramCanvas,
    DiagramBackground,
    DiagramControls,
  } from '@project/diagram-svelte';

  import ArticleNode from './ArticleNode.svelte';
  import ImageNode from './ImageNode.svelte';

  const engine = createDiagramEngine({ project });

  const nodeTypes = {
    article: ArticleNode,
    image: ImageNode,
  };
</script>

<DiagramProvider {engine}>
  <DiagramCanvas {nodeTypes}>
    <DiagramBackground />
    <DiagramControls />
  </DiagramCanvas>
</DiagramProvider>
```

### 13.2 주요 컴포넌트

React adapter와 개념적 이름을 맞춘다.

다만 Svelte의 snippet, context, action, rune/store 사용 방식은 네이티브하게 설계한다.

### 13.3 구독

Engine의 `subscribe`를 Svelte readable store 형태로 변환한다.

```ts
export function diagramStore<T>(
  engine: DiagramEngine,
  selector: (snapshot: DiagramSnapshot) => T,
): Readable<T>;
```

모든 컴포넌트가 전체 snapshot을 구독하지 않도록 한다.

---

## 14. 노드 렌더러 계약

### 14.1 공통 props 개념

```ts
export interface NodeRendererProps<TData = unknown> {
  nodeId: string;
  type: string;
  data: TData;

  selected: boolean;
  dragging: boolean;
  resizing: boolean;
  readonly: boolean;

  sceneId: string;
  transition?: NodeTransitionContext;
}
```

### 14.2 사용자 이벤트

노드 내부의 버튼, 입력 필드, 링크를 조작할 때 노드 드래그가 시작되지 않아야 한다.

공통 속성 또는 helper를 제공한다.

```html
<button data-diagram-no-drag>Open</button>
<input data-diagram-no-drag />
<div data-diagram-no-pan />
```

키보드 이벤트도 편집 가능한 요소와 캔버스 단축키 간 충돌을 방지한다.

### 14.3 Tooltip과 Portal

노드 내부 Tooltip과 개념 미리보기가 canvas transform, phone mockup, node 또는 panel의
`overflow`에 잘리지 않도록 앱 최상위에 `PortalLayer`를 제공한다. Overlay는 활성화한
참조의 화면상 경계를 기준으로 가까운 쪽에 배치하고, viewport 가장자리에서는 방향을
뒤집거나 안쪽으로 이동한다.

- DOM과 SVG 참조는 실제 요소의 `getBoundingClientRect()`를 anchor로 사용한다.
- canvas로 직접 그린 참조는 hit region이 제공하는 virtual anchor rect를 사용한다.
- 완전한 canvas renderer도 keyboard와 screen reader용 DOM control을 함께 제공하며 같은
  `ConceptPreview`를 연다.
- renderer가 달라도 점선 밑줄, surface, spacing, shadow, open·close state와 내용 구조는
  같은 semantic token과 component 규칙을 사용한다.
- 개념 참조는 글자와 가까운 점선 밑줄로 표시한다. 설명 문장을 덧붙여 클릭 방법을
  반복하지 않으며, hover·focus·click·tap으로 미리보기를 열 수 있게 한다.

사용자 디자인 시스템의 portal을 그대로 사용할 수 있도록 강제 구현은 피한다.

---

## 15. Serialization

### 15.1 JSON 원칙

- 함수 저장 금지
- React/Svelte 컴포넌트 저장 금지
- DOM reference 저장 금지
- Date는 ISO string
- Map/Set은 JSON 호환 구조로 변환
- schemaVersion 필수
- unknown data는 validator 제공

### 15.2 Schema

Zod, Valibot 또는 JSON Schema 중 하나를 사용한다.

공개 interchange format이 중요하므로 JSON Schema 생성을 고려한다.

```ts
interface SerializedDiagramProject {
  schemaVersion: number;
  // ...
}
```

### 15.3 Migration

```ts
export interface ProjectMigration {
  from: number;
  to: number;
  migrate(input: unknown): unknown;
}
```

로드 순서:

1. JSON parse
2. 최소 구조 검사
3. schema version 확인
4. 순차 migration
5. 최신 schema validation
6. engine load

---

## 16. 자동 레이아웃

자동 레이아웃은 코어에 직접 종속시키지 않는다.

```ts
export interface LayoutEngine {
  layout(input: LayoutInput, options?: unknown): Promise<LayoutResult>;
}
```

초기 adapter 후보:

- Dagre: 단순 directed graph
- ELK: 복잡한 hierarchical/orthogonal layout

자동 레이아웃 실행 결과는 명령 하나로 commit한다.

```ts
engine.dispatch({
  type: 'nodes.move',
  payload: {
    sceneId,
    positions: layoutResult.positions,
  },
});
```

### 16.1 시맨틱 줌용 자동 묶음

자동 레이아웃과 자동 묶음은 구분한다. 자동 레이아웃은 노드의 저장 위치를 바꾸지만, 자동
묶음은 축소된 화면에서 여러 노드를 하나의 요약 단위로 보여 주는 계산 결과다. 공식 웹앱은
최소한 다음 신호를 조합해 묶음 후보를 만들어야 한다.

- 화면과 캔버스에서 가까운 거리
- 직접 연결과 공통 이웃 등 그래프 관계
- 부모·자식 또는 포함 관계
- 제목, 설명, 노드 종류 등 내용 유사도
- 현재 슬라이드와 단계에서 함께 등장하는 정도

묶음 제안은 안정적인 후보 ID, 포함 노드 ID, 제안 이름, 제작자에게 설명할 짧은 근거를
가져야 한다. 제작자가 이름이나 포함 노드를 수정하면 command를 통해 덮어쓴 값으로 저장한다.
노드가 추가·삭제·이동된 뒤 제안을 언제 유지하거나 다시 계산할지는 Q-014에서 결정한다.

---

## 17. Web Component 배포

Web Component는 보조 배포 형태다.

권장 용도:

- 외부 사이트 임베드
- 읽기 전용 viewer
- 제한된 편집기
- React/Svelte 이외 환경

비권장 용도:

- React/Svelte 앱에서 네이티브 컴포넌트를 노드 내부에 넣어야 하는 경우
- 앱의 Context, store, portal, design system과 강하게 통합해야 하는 경우

따라서 MVP의 핵심 배포물로 만들지 않는다.

우선순위:

1. core
2. Svelte adapter와 공식 demo
3. timeline 기반 editor/viewer vertical slice
4. React adapter
5. Web Component viewer
6. Web Component editor

---

## 18. 협업 편집

MVP 범위에서 제외하되 Command 모델과 document state가 협업 확장을 방해하지 않아야 한다.

향후 Yjs 등과 연동할 수 있도록 다음을 유지한다.

- stable node/edge/scene IDs
- 명령의 명시적 payload
- transaction
- deterministic serialization
- ephemeral presence와 document state 분리
- local selection을 프로젝트 JSON에 저장하지 않음

협업 상태:

```ts
interface PresenceState {
  userId: string;
  cursor?: XYPosition;
  selectedNodeIds: string[];
  activeSceneId?: string;
}
```

---

## 19. 접근성

최소 기준:

- 캔버스 컨테이너 focus 가능
- 노드 keyboard navigation
- 선택 상태를 ARIA로 표현
- 키보드만으로 노드 이동 가능
- 연결 생성의 대체 조작 제공 검토
- Tooltip은 hover 외 focus로도 표시
- 색상만으로 상태를 구분하지 않음
- reduced motion 대응
- 모바일 Viewer의 touch target 크기와 간격 확보
- hover 없이도 tap, focus, keyboard로 개념 미리보기와 navigation 가능
- 모바일 화면 회전과 확대 시 콘텐츠 및 player control 접근성 유지

```css
@media (prefers-reduced-motion: reduce) {
  /* transition duration 축소 또는 제거 */
}
```

재생 API에는 reduced motion 정책을 넣는다.

```ts
type ReducedMotionPolicy = 'respect-system' | 'always' | 'never';
```

---

## 20. 성능 목표

초기 검증 기준:

### 편집 모드

- 500개 HTML 노드 + 800개 SVG 엣지에서 일반적인 pan/zoom 가능
- 선택된 노드 드래그 시 시각적으로 끊김이 없어야 함
- 단일 노드 편집이 전체 노드 재렌더링을 유발하지 않아야 함
- viewport 밖 노드/엣지 culling 옵션 제공

### 재생 모드

- 200개 가시 노드의 위치/opacity 전환 가능
- 프레임마다 프로젝트 전체 deep clone 금지
- 프레임마다 DOM layout read/write 혼합 금지
- `getBoundingClientRect` 호출을 배치하고 캐시
- animation frame 중 JSON serialization 금지

### 모바일 Viewer

- Viewer 진입점은 Editor 전용 panel, history UI, authoring dependency를 포함하지 않아야 함
- 작은 viewport에서 현재 단계의 핵심 콘텐츠와 재생 control이 함께 사용 가능해야 함
- touch 기반 단계 이동과 concept preview가 지속적인 layout thrashing을 유발하지 않아야 함
- 모바일 성능 예산과 지원 기기 기준은 Q-005에서 구체화

### 메모리

- history 최대 크기 또는 byte budget 설정
- 제거된 Scene/노드 참조 누수 방지
- subscription 해제 검증
- portal과 ResizeObserver 정리 검증

---

## 21. 테스트 전략

### 21.1 Unit

`core`, `geometry`, `timeline`은 DOM 없이 테스트 가능해야 한다.

필수 테스트:

- command 적용
- inverse patch
- transaction
- undo/redo
- scene diff
- node enter/update/exit
- viewport interpolation
- screen/canvas 좌표 변환
- edge path
- serialization migration
- timeline seek determinism
- canvas interaction state transition
- cursor 기준 zoom과 keyboard nudge
- 자동 묶음의 stable ID와 parent-child 포함

### 21.2 Contract test

React와 Svelte adapter가 동일한 core 동작을 노출하는지 검증한다.

동일 fixture를 두 playground에서 실행한다.

예:

- node add
- node move
- edge add
- scene transition
- undo
- export JSON

결과 project JSON이 동일해야 한다.

### 21.3 Browser E2E

Playwright 권장.

필수 시나리오:

1. 노드 생성
2. 드래그
3. 리사이즈
4. handle 연결
5. 노드 내부 input 편집
6. input 조작 중 노드가 드래그되지 않음
7. Scene 생성 및 복제
8. 카메라 저장
9. 다음 Scene 재생
10. 노드 이동/등장/삭제 확인
11. viewport zoom transition 확인
12. Undo/Redo
13. 프로젝트 export/import
14. React와 Svelte viewer 결과 비교
15. 데스크톱 viewport에서 Editor의 생성·선택·drag·resize·단계 편집
16. 모바일 portrait viewport에서 Viewer의 이전·다음 단계 touch 조작
17. 모바일 Viewer에서 개념 참조 tap, 미리보기, 닫기, 원 설명 이동
18. Viewer에 Editor 전용 control이 렌더링되지 않음
19. 부모 안의 하위 노드 상세를 mouse·touch·keyboard로 열고 닫은 뒤 집중 보기로 이동
20. 미리 묶지 않은 노드를 축소했을 때 자동 묶음 제안 생성
21. 묶음 이름과 포함 노드를 수정하고 원래 노드 강조로 확인한 뒤 다시 축소해 수정 유지
22. 노드 안의 버튼을 조작할 때 node drag나 canvas pan이 시작되지 않음
23. selection·drag·pan·zoom·keyboard nudge가 디자인 시스템의 같은 interaction state를 사용
24. 390×844와 430×932에서 첫·중간·최종 스텝 직접 진입 시 실제 현재 열이 viewport 안에 있고 문서 가로 넘침이 없음
25. 모바일 canvas drag의 pointer up 직후와 대기 후 scroll offset이 같아 스냅·관성·지연된 자동 이동이 없음

### 21.4 Visual regression

다음 상태를 screenshot fixture로 관리한다.

- 기본 canvas
- selected node
- connection preview
- resize
- Scene 중간 frame 25%, 50%, 75%
- zoomed viewport
- custom HTML node
- Tooltip/Popover
- 모바일 portrait Viewer
- 모바일 landscape Viewer
- Viewer player controls와 concept preview

---

## 22. MVP 범위

### 포함

- framework-agnostic core
- Svelte adapter를 첫 renderer로 구현
- 데스크톱 우선 Svelte Editor demo
- 모바일 우선 Svelte Viewer demo
- Editor와 Viewer의 독립 진입점
- React adapter를 후속 cross-framework milestone로 구현
- HTML custom node
- SVG edge
- node drag/select/delete
- edge connect/delete
- pan/zoom
- viewport save
- Scene create/duplicate/delete/reorder
- Scene 간 node/edge/viewport transition
- Undo/Redo
- JSON export/import
- 기본 controls
- 기본 resizer
- 시맨틱 줌용 자동 묶음 제안과 제작자 검토·수정
- Svelte demo와 후속 React playground
- semantic token, 일반 UI, canvas component, interaction state를 포함한 디자인 시스템
- unit 및 E2E test

### 제외

- 실시간 공동 편집
- 자유곡선 그리기
- BPMN 완전 지원
- UML 완전 지원
- 복잡한 orthogonal routing
- After Effects 수준 타임라인 UI
- 비디오 export
- server rendering of editable canvas
- Canvas/WebGL-only renderer
- 플러그인 marketplace
- Web Component full editor

---

## 23. 구현 순서

### Phase 1: Core vertical slice

1. 모노레포 생성
2. core model 작성
3. command dispatcher
4. snapshot subscription
5. history
6. geometry 좌표 변환
7. Scene 데이터 모델
8. serialization schema

완료 조건:

- DOM 없이 node add/move/delete와 undo/redo 테스트 통과
- Scene 두 개를 JSON으로 생성 및 복원 가능

### Phase 2: Svelte Renderer와 공식 Demo

Svelte를 첫 renderer로 구현하고, 공식 demo를 라이브러리의 reference consumer이자 end-to-end 검증 앱으로 사용한다.

구현:

1. provider
2. canvas
3. HTML node layer
4. SVG edge layer
5. pan/zoom
6. selection
7. drag
8. handles
9. resize
10. controls
11. Svelte 기반 demo app shell
12. 데스크톱 우선 Editor route와 layout
13. 모바일 우선 Viewer route와 player controls
14. Editor에서 만든 작은 강의를 Viewer에서 재생하는 대표 시나리오

완료 조건:

- 제작자가 데스크톱 demo Editor에서 기본 다이어그램과 슬라이드 단계를 편집 가능
- 소비자가 모바일 demo Viewer에서 같은 콘텐츠의 단계 애니메이션을 재생 가능
- custom HTML node에서 input, image, tooltip 동작
- Viewer가 Editor 전용 UI 없이 독립 진입점으로 로드됨
- demo 코드가 라이브러리 public API만 사용하여 권장 통합 예제로 기능

### Phase 3: Timeline

1. Scene diff
2. interpolation
3. timeline player
4. viewport animation
5. node enter/update/exit
6. edge transition
7. Scene controls
8. reduced motion

완료 조건:

- Scene A → B 이동 시 노드 생성/이동/삭제와 카메라 전환 동작
- seek가 deterministic

### Phase 4: React Renderer

1. Svelte 구현에서 공통 renderer-dom 유틸 추출
2. React framework adapter 구현
3. contract fixture 공유
4. API 차이 문서화
5. rendering parity 검증

완료 조건:

- 동일 project JSON이 React/Svelte에서 동일 의미로 렌더링
- 핵심 E2E 시나리오 양쪽 통과

### Phase 5: Editor UX

1. node palette
2. property inspector
3. Scene sidebar
4. camera capture
5. transition inspector
6. keyboard shortcuts
7. autosave integration hooks
8. clipboard copy/paste
9. concept asset library와 검색
10. 본문 내 concept reference 저작
11. concept preview, 원 설명 이동, 관련 개념 탐색
12. 자동 묶음 제안 검토, 이름 변경, 포함 노드 조정, 원래 노드 강조 확인
13. 디자인 시스템 카탈로그와 canvas interaction 상태 검증 화면

---

## 24. 에이전트 구현 규칙

코딩 에이전트는 다음 규칙을 준수한다.

### 24.1 금지

- core에서 React/Svelte import 금지
- 프로젝트 JSON에 컴포넌트나 함수 저장 금지
- 모든 pointer move를 history entry로 저장 금지
- 노드별로 독립적인 전역 event listener 생성 금지
- animation frame마다 전체 snapshot deep clone 금지
- React 구현 세부사항을 Svelte API에 강제 복제 금지
- DOM 측정 로직을 core에 포함 금지
- 사용자 노드 콘텐츠를 무조건 `innerHTML`로 렌더링 금지

### 24.2 필수

- 모든 외부 상태 변경은 command 사용
- stable ID 사용
- 순수 함수 가능한 로직은 geometry/timeline에 위치
- framework adapter 간 contract fixture 공유
- 모든 subscription과 observer cleanup
- schema version과 migration 작성
- public API에 TSDoc 작성
- 성능에 민감한 구독은 selector 기반
- node content interaction과 canvas gesture 충돌 테스트
- Scene 전환 중 중단, seek, 역방향 이동 고려

### 24.3 보안

외부 HTML 문자열을 지원해야 할 경우 기본값은 sanitize다.

권장 API:

```ts
interface HtmlNodeData {
  sanitizedHtml: string;
}
```

라이브러리가 raw HTML을 자동 신뢰해서는 안 된다.

사용자 제공 URL, image URL, link target 정책은 소비 애플리케이션이 제어할 수 있도록 hook을 제공한다.

---

## 25. 주요 설계 결정

### 결정 1: 단일 Web Component를 핵심 구현으로 사용하지 않음

이유:

- React/Svelte 네이티브 노드 컴포넌트 사용성이 중요
- Context와 store 통합 필요
- Tooltip/Popover portal 통합 필요
- 앱 디자인 시스템과 자연스럽게 결합해야 함

Web Component는 나중에 viewer 또는 제한된 editor로 제공한다.

### 결정 2: Slide/Step 전환 기반 MVP

제품은 PowerPoint처럼 여러 슬라이드를 만들고, 각 슬라이드 안에서 설명을 단계별로 진행하는 mental model을 사용한다. 엔진 MVP는 먼저 개별 Step 상태와 그 사이의 단계 애니메이션을 구현한다. 처음부터 자유로운 속성 keyframe timeline editor를 만들지 않는다.

이유:

- 일반 사용자에게 슬라이드와 단계가 친숙함
- 하나의 설명 단위와 그 안의 점진적 변화를 구분할 수 있음
- 프로젝트 범위를 제어하면서 node/viewport interpolation의 핵심 가치를 검증할 수 있음
- 이후 세부 속성 애니메이션 트랙으로 확장 가능

### 결정 3: DOM 노드 + SVG 엣지

이유:

- 노드 내부 자유로운 HTML 지원
- 텍스트와 폼 접근성
- SVG path 기반 엣지 스타일링
- 디버깅과 확장성

### 결정 4: 공통 엔진 + 별도 renderer

이유:

- React/Svelte 간 document와 timeline 공유
- 각 프레임워크의 네이티브 컴포넌트 지원
- 테스트 가능한 순수 코어
- 장기적인 Vue/Web Component 확장 가능

### 결정 5: 애니메이션 중간 상태와 영속 상태 분리

이유:

- 프레임마다 history가 오염되는 문제 방지
- 프레임워크 전체 rerender 방지
- seek와 cancel 처리 용이
- 최종 상태 commit 명확화

---

## 26. 참고 구현 및 근거

### xyflow

xyflow는 React Flow와 Svelte Flow를 하나의 모노레포에서 관리하며 공통 helper/system 패키지를 둔다. 본 프로젝트의 `core + react + svelte` 구조를 설계할 때 주요 참고 사례로 사용한다.

- https://github.com/xyflow/xyflow
- https://xyflow.com/
- https://reactflow.dev/
- https://svelteflow.dev/

주의:

`@xyflow/system`을 안정적인 독립 headless SDK로 가정해 직접 의존하지 않는다. 구조와 알고리즘을 참고하되 자체 public contract를 작성한다.

### React Flow

참고 대상:

- custom node
- node/edge interaction
- viewport
- fit view duration
- visible-element rendering
- controls
- subflow
- save/restore 패턴

- https://reactflow.dev/learn/customization/custom-nodes
- https://reactflow.dev/api-reference/react-flow
- https://reactflow.dev/api-reference/types/fit-view-options

### Web Components

Web Component는 Custom Elements와 Shadow DOM을 통해 재사용 가능한 캡슐화 UI를 제공한다. 그러나 본 프로젝트에서는 native framework node extensibility 때문에 보조 배포 방식으로만 사용한다.

- https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM

---

## 27. Definition of Done

MVP는 다음 조건을 모두 만족해야 완료로 간주한다.

- [ ] 제작자가 Svelte 공식 demo의 데스크톱 Editor에서 작은 강의를 생성·편집 가능
- [ ] 소비자가 같은 강의를 Svelte 공식 demo의 모바일 Viewer에서 재생·탐색 가능
- [ ] Viewer가 Editor 전용 UI와 dependency 없이 독립 진입점으로 로드 가능
- [ ] 동일한 `DiagramProject` JSON을 React와 Svelte에서 로드 가능
- [ ] 양쪽에서 custom framework component를 노드로 등록 가능
- [ ] 노드 내부 image, text, input, tooltip 사용 가능
- [ ] 최종 사용자가 노드 생성, 이동, 리사이즈, 삭제 가능
- [ ] 최종 사용자가 엣지 생성 및 삭제 가능
- [ ] pan/zoom 및 fit view 가능
- [ ] 축소 시 앱이 묶음을 자동 제안하고 제작자가 이름과 포함 노드를 수정 가능
- [ ] 부모 안의 하위 노드가 상세 보기 가능 여부를 알리고 mouse·touch·keyboard로 열림
- [ ] Svelte 디자인 시스템 패키지가 token·일반 UI·canvas component를 제공
- [ ] 선택·drag·pan·zoom·keyboard·노드 내부 gesture 차단이 공통 interaction system으로 동작
- [ ] Scene별 viewport 저장 가능
- [ ] Scene 전환 시 노드 enter/update/exit 애니메이션 가능
- [ ] Scene 전환 시 viewport pan/zoom 애니메이션 가능
- [ ] 재생, 일시정지, seek 가능
- [ ] Undo/Redo 가능
- [ ] JSON export/import 가능
- [ ] schema migration 테스트 존재
- [ ] React/Svelte contract tests 통과
- [ ] 주요 Playwright E2E 시나리오 통과
- [ ] reduced motion 지원
- [ ] raw HTML을 기본 신뢰하지 않음
- [ ] core 패키지에 React/Svelte dependency가 없음

---

## 28. 첫 구현 작업 목록

에이전트는 다음 순서로 첫 PR을 작성한다.

1. pnpm workspace와 Turborepo 설정
2. `packages/core`, `geometry`, `timeline`, `serialization` 생성
3. 공통 TypeScript config와 lint/test 설정
4. `DiagramNode`, `DiagramEdge`, `DiagramScene`, `DiagramProject` 타입 작성
5. `createDiagramEngine` 최소 구현
6. `subscribe`, `getSnapshot`, `dispatch` 구현
7. node add/move/remove command 구현
8. transaction과 undo/redo 구현
9. viewport 좌표 변환 함수 구현
10. Scene A/B diff와 linear interpolation 구현
11. JSON schemaVersion 및 validator 구현
12. unit test 작성
13. Svelte 기반 공식 demo app 생성
14. HTML node + SVG straight edge를 렌더링하는 Svelte vertical slice 구현
15. 데스크톱 Editor에서 두 단계를 편집하는 demo 시나리오 작성
16. 같은 콘텐츠를 모바일 Viewer에서 재생하는 demo 시나리오 작성

첫 PR에서 구현하지 않을 것:

- minimap
- collaboration
- advanced edge routing
- keyframe editor
- automatic layout UI
- Web Component
- rich text editor 내장
- complex animation preset

첫 PR의 목표는 다음 한 문장으로 정의한다.

> **하나의 슬라이드에 두 개의 단계(Step)를 가진 프로젝트를 Svelte demo에서 로드하고, 노드를 편집한 뒤 단계 애니메이션을 재생할 수 있는 최소 vertical slice를 구축한다.**
