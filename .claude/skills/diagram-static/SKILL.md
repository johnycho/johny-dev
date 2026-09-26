# 정적 다이어그램 스킬 (코드 → SVG/Mermaid)

구조·시퀀스·클래스/ER·상태·액티비티·인프라 등 **정적 다이어그램**을 코드로 그린다. 세 가지 시각화 방식 중 **기본값**이며, 대부분의 다이어그램은 이 스킬로 충분하다. 형식·MDX 규칙은 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md) 4절을 함께 본다.

> 방식 선택: 인터랙티브 탐색이 필요하면 [diagram-archify](../diagram-archify/SKILL.md), 시간에 따른 지표·추이·분포는 [chart-canvas](../chart-canvas/SKILL.md). 그 외 정적 그림은 전부 이 스킬.

## 우선순위(분기) — C4-PlantUML → PlantUML → Mermaid

1. **C4-PlantUML로 표현 가능하면 무조건 C4-PlantUML.** 시스템 컨텍스트·컨테이너·컴포넌트, 시스템 간 연동, 필요 시 배포(`C4_Deployment`)·런타임 상호작용(`C4_Dynamic`).
2. **C4로 안 되면 PlantUML.** 시퀀스·클래스/ER·상태·액티비티·컴포넌트 등 PlantUML이 지원하는 건 거의 다. 코드 레벨(레벨 4)은 C4가 아니라 일반 `plantuml` 클래스 다이어그램으로.
3. **Mermaid는 최후 수단.** PlantUML로도 마땅치 않을 때만.

## A. C4-PlantUML / PlantUML (Kroki로 정적 SVG)

절차:
1. **`.puml` 작성** — **C4**면 `!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml`(또는 `C4_Container.puml`·`C4_Component.puml`) + `LAYOUT_LEFT_RIGHT()`(가로 배치). **일반 PlantUML**은 include 없이 그냥 작성.
2. **렌더(Kroki)** — C4는 `curl -X POST https://kroki.io/c4plantuml/svg --data-binary @x.puml -o static/img/c4/<name>.svg`, 일반 PlantUML은 `.../plantuml/svg`. **HTTP 200·`<svg` 시작 확인**, 오류(400)면 문법 고쳐 재시도.
   - 자주 나는 400: 한 줄 `skinparam` 블록(→ 여러 줄로), 중첩 그룹+라벨 엣지, 대규모 한글 ER의 crow's-foot(→ 클래스 다이어그램으로), `[PK]` 대괄호 대량 사용(→ `: PK`). 겹침이 심하면 다이어그램을 나눈다.
   - **화살표·엣지 라벨은 iOS Safari에서 깨질 수 있는 형태를 피한다.** PlantUML은 라벨에 `lengthAdjust="spacing"`을 걸어 렌더하는데, **이중 공백**(`request(n)  (…)`)이나 **중첩 괄호**가 있으면 iOS Safari에서 글자 간격이 벌어져 텍스트가 깨져 보인다. 라벨은 **공백 하나**로 붙이고 괄호 중첩을 피한다: `request(n)  (받을 개수 요청)` → `request(n) 받을 개수 요청`. 부연이 필요하면 `note`로 뺀다.
3. **본문 삽입** — 접이식 코드 + 이미지:
   ```md
   <details>
   <summary>C4-PlantUML 코드</summary>

   ` ``plantuml
   ...코드...
   ` ``

   </details>

   ![C4 …](/img/c4/<name>.svg)
   ```
4. **alt 접두어**: **C4 다이어그램은 `C4 `로, 일반 PlantUML은 `PlantUML `로 시작**(`custom.css`의 `img[alt^="C4 "], img[alt^="PlantUML "]`가 흰 배경 카드로 표시). SVG 교체 후 반영이 안 보이면 `npm run clear` 후 재빌드.

**인프라(클라우드·플랫폼) 다이어그램**은 실제 아이콘을 쓴다 — PlantUML 표준 아이콘 라이브러리를 `!include`로 불러 `plantuml` 엔드포인트로 렌더(alt는 `PlantUML `). 예: AWS `!include <awslib14/AWSCommon>` + `<awslib14/Compute/EC2>`·`<awslib14/Containers/ElasticKubernetesService>`·`<awslib14/Containers/ElasticContainerRegistry>` 등, 그룹 `<awslib14/Groups/AWSCloud>`. (쿠버네티스 `<kubernetes/...>`, 기타 로고 `<logos/...>`.) **이미지에 넣기 어려운 풀네임은 이미지 말고 본문 텍스트로** 푼다.

C4 개념은 [C4 모델 글](../../../blog/2026-09-04-c4-model-architecture-diagram.mdx) 참고.

## B. Mermaid (최후 수단)

- **` ```mermaid ` 코드블록**으로 그린다(ASCII 아트 금지 — 한글은 코드블록에서 2칸 폭이라 열 정렬이 깨짐). `docusaurus.config.ts`에 활성화됨(`markdown.mermaid: true`).
- 노드 라벨 줄바꿈은 `<br/>`. 단순 화살표 한 줄(`A → B → C`)이면 굳이 그리지 않는다.
- **`C4Context` 등 Mermaid의 C4 타입은 쓰지 않는다**(실험적이라 라벨이 겹쳐 깨짐). C4는 반드시 A의 C4-PlantUML로.
- **git 커밋 그래프는 `gitGraph`** — Git 브랜치 흐름(분기·병합·태그)은 PlantUML로 마땅치 않으니 mermaid `gitGraph`를 쓴다. 주의: `merge`는 **양쪽 브랜치가 갈라져 있어야**(fast-forward 불가) 하므로, 독립 커밋 없이 상류를 그대로 내려받는 **환경 브랜치 승격**은 gitGraph로 표현 못 한다(그럴 땐 `flowchart` 또는 각 브랜치에 승격 커밋을 준다). `commit id:`/`tag:` 문자열엔 **공백을 넣지 않는다**(파싱 깨짐).

## 검증
- `npm run build`로 렌더 확인. **단, 빌드는 mermaid(특히 `gitGraph`·`flowchart`)의 문법 오류를 못 잡는다 — 브라우저에서만 깨진다.** 복잡한 mermaid는 발행 전 **Kroki로 문법 검증**한다: `curl -s -o /dev/null -w "%{http_code}" -X POST https://kroki.io/mermaid/svg --data-binary @diagram.mmd` → `200`이면 통과, `400`이면 문법 오류. (PlantUML도 동일하게 `kroki.io/plantuml/svg`로 검증 — 조건문 안 중첩 괄호 등 주의.)
- 작성·수정 후 [blog-review](../blog-review/SKILL.md)로 다이어그램 규칙(우선순위·alt 접두어·Mermaid C4 금지) 점검.
