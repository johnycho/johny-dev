# 손수 작성 SVG 개념도 스킬 (hand-authored SVG)

`<rect>`·`<text>`·`<line>` 좌표를 **직접 배치**해 만든 **정적 SVG 개념도/설명도**를 넣는다. 라이브러리·렌더 도구 없이 손으로 그리므로 **레이아웃을 완전히 통제**할 수 있다. PlantUML/C4/Mermaid의 자동 레이아웃으로는 의도대로 안 나오는 그림을 깔끔하게 그릴 때 쓴다. 형식·MDX·모바일 폭 규칙은 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md) 4절을 함께 본다.

> 방식 선택: **블로그 그림은 이 스킬이 유일한 방식이다**(PlantUML, Mermaid, archify는 보관, 미사용). 구조, 시퀀스, 판단 흐름, 상태, 인프라, 공간 배치형 개념도 모두 손수 SVG로 그린다. 요소가 아주 많아 440~520px 안에 의도를 담을 수 없을 때만 [diagram-static](../diagram-static/SKILL.md)(PlantUML). 지표·추이·분포는 [chart-canvas](../chart-canvas/SKILL.md). 인터랙티브는 꼭 필요할 때만 [diagram-archify](../diagram-archify/SKILL.md).

## 언제 쓰나 (기본)

블로그의 **정적 그림은 모두 이 스킬이 기본**이다. PlantUML 자동 레이아웃은 가로로 길게 펼쳐져 본문 폭에서 줄어들면 글자가 작아지고, 소스를 고친 뒤 다시 렌더하지 않으면 그림이 소스와 달라진다.

- **시퀀스**: 참여자를 위쪽 상자와 세로 점선(lifeline)으로 두고, 메시지 화살표를 번호(원 배지)와 함께 위에서 아래로 쌓는다. 참여자가 5개를 넘어 폭이 모자라면 중심 참여자를 가운데 두는 허브 배치 + 번호 화살표 + 아래쪽 단계 범례로 그린다.
- **판단 흐름(액티비티)**: 질문 상자와 `Y`/`N` 분기를 위에서 아래로, 결론 상자는 색으로 구분한다.
- **구조, 인프라**: 그룹(점선 박스)과 구성 요소 상자, 라벨 붙은 화살표.
- **공간 배치형**: 겹치는 범위 막대, 축/타임라인 위 구간, 인덱스 행, 메모리 레이아웃, 2×2 비교.

큰 그림은 세로 배치나 두 그림으로 나누기로 440~520px 안에 담는다.

## 장점
- **레이아웃 완전 통제** — 좌표·색·정렬·겹침을 원하는 대로.
- **SEO·선명도** — 본문 인라인 SVG는 색인되고, 벡터라 확대해도 또렷(archify iframe과 달리 색인됨).
- **의존성 0** — 렌더 서버·CLI 불필요. 모바일 폭도 `width`로 자유 조절.

## 절차

1. **구상·스케치** — 무엇을 보여줄지 한 문장으로 정하고, 칸/막대/축의 좌표를 대략 잡는다(가로 폭 먼저 정함 → 모바일 상한 고려).
2. **작성** — `static/img/c4/<name>.svg`에 직접 작성. 루트에 `width`/`height`/`viewBox`와 `font-family`를 둔다:
   ```
   <svg xmlns="http://www.w3.org/2000/svg" width="440" height="282" viewBox="0 0 440 282"
        font-family="-apple-system, 'Segoe UI', 'Noto Sans KR', sans-serif">
     <rect x="0" y="0" width="440" height="282" fill="#FFFFFF"/>   <!-- 배경 흰색 필수 -->
     ...
   </svg>
   ```
   - 텍스트는 `text-anchor="middle"` + 칸 중심 x로 가운데 정렬. 폰트 크기 제목 13·본문 11~12·보조 9.5.
   - 배경 흰색 `<rect>`를 먼저 깐다(다크모드에서 투명 배경이면 글자가 안 보임).
3. **팔레트(사이트 일관)** — PlantUML 다이어그램과 같은 색 계열로 맞춘다.

   | 역할 | fill | stroke | text |
   |---|---|---|---|
   | 파랑(주체 A·조회) | `#EEF3FB` / 막대 `#D6E4FB` | `#4C7FE0`·`#B9CBE8` | `#26508F` |
   | 분홍(주체 B·보유) | `#FCE4EC` / 막대 `#FBDCE4` | `#D06A86`·`#E0A8BC` | `#9E3A57`·`#B0486A` |
   | 주황(갭·중간) | `#FFF3E0` | `#E8C98F` | `#222222` |
   | 초록(정상·성공) | `#E9F2E9` | `#8FBF8F` | `#2E6B2E` |
   | 회색/배경 | `#F7F7F7` | `#999999` | 본문 `#333`·보조 `#888` |
   | 강조 박스(겹침·주의) | `#FFFBEA` | `#E0A000` (점선 `stroke-dasharray="5 4"`) | — |

   - **그림 안 텍스트(라벨, 제목, 범례, alt)도 [word-choice](../../wiki/word-choice.md)와 [phrasing-style](../../wiki/phrasing-style.md)을 따른다.** 구어 라벨 금지(꽉 찬, 손볼 곳, 번지는, 옆 기능, 튐, 났을). 삽입 후 `scan-polishing.py`로 ```svg 블록의 `<text>`까지 검사한다. 본문에 없는 수치나 이름은 그림에만 넣지 않는다.
   - **분기 라벨은 `Y` / `N`** 으로 쓴다(예/아니오 금지). 부연이 필요하면 `N, 아직`처럼 뒤에 붙인다.
4. **모바일 폭** — `width`는 **이상적 ~360, 안전 상한 ~480, 최대 520**(초과 시 모바일에서 축소돼 글자 작아짐). 원리·근거는 blog-authoring 4절과 동일. 폭은 **글자가 칸을 넘지 않는 선에서 가장 좁게**.
5. **검증(필수)** — 두 가지를 반드시 한다:
   - **XML 유효성**: `python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('static/img/c4/<name>.svg'); print('OK')"`
   - **눈으로 확인**: PNG로 변환해 **반드시 렌더 결과를 본다**(글자 넘침·겹침·정렬·잘림). macOS: `qlmanage -t -s 880 -o /tmp static/img/c4/<name>.svg` → 생성된 `/tmp/<name>.svg.png`를 Read로 연다. 어긋나면 좌표·폭·폰트를 고쳐 재확인.
6. **블로그 삽입** — `<details>`에 **SVG 소스 전문**(파일과 글자 하나까지 같게. 문구를 고칠 때도 둘을 함께 고친다. 다르면 스캐너가 `그림불일치`로 지적), 그 아래 **`<figure>`로 감싼 이미지**(가운데 정렬 + PC 확대 + 모바일 반응형):
   ```mdx
   <details>
   <summary>SVG 코드</summary>

   ` ``svg
   <svg ...>...</svg>
   ` ``

   </details>

   <figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
     <img src="/img/c4/<name>.svg" alt="인덱스 위에서 두 작업의 잠금 범위가 겹치는 구간" style={{width: '100%', maxWidth: '640px'}} />
   </figure>
   ```
   - **`<figure>` 임베드 이유**: 마크다운 `![]()`는 **좌측·원본 크기**로 나와 PC에서 작아 보인다. `textAlign:center`로 가운데 정렬하고, `width:100% + maxWidth`로 **PC에서는 원본보다 키우고**(벡터라 또렷) **모바일은 화면 폭에 맞춰 축소**한다. `maxWidth`는 원본 폭보다 크게(예: 440 원본 → `640px`), 다만 **본문 폭(~720px)은 넘지 않게**.
   - **alt는 도구 접두사(`C4 `/`PlantUML `) 없이** 그림 내용을 서술한다(손수 SVG는 그 둘이 아님). JSX라 `style={{…}}` 객체 문법·자기닫힘 `<img … />`을 지킨다.
   - 본문에 raw `<svg>`를 직접 쓰지 말 것 — **반드시 파일로 저장해 `<img src>`로 참조**(MDX가 JSX로 해석해 깨짐). raw `<`는 `` ```svg `` 코드펜스 안에서만.
7. **기밀·저작권** — 사내 식별자·실명·이메일·테이블명·티켓번호는 **일반화**해 넣지 않는다. 다른 글·도구의 이미지를 베끼지 말고 개념만 재현한다([blog-authoring](../../wiki/blog-authoring.md) 4절 저작권).

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. 사용자가 명시적으로 요청할 때만.

## 참고
- 방식 선택·모바일 폭·저작권: [blog-authoring.md](../../wiki/blog-authoring.md) 4절
- 다른 시각화: [chart-canvas](../chart-canvas/SKILL.md)(지표 애니메이션). 예외(사용자 승인 글만): anatomy 인터랙티브 등각 모형(`tools/anatomy/`, `<AnatomyEmbed>`, blog-authoring 4절). 보관, 미사용: [diagram-static](../diagram-static/SKILL.md), [diagram-archify](../diagram-archify/SKILL.md)
