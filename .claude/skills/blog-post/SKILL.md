---
name: blog-post
description: 마크다운 초안(예: ~/Downloads/*.md)이나 주제를 johny-dev 기술 블로그 게시글(blog/*.mdx)로 변환·작성한다. "블로그 글 추가", "이 md 포스트로 만들어줘", "게시글 작성" 등의 요청에 사용.
---

# 게시글 작성 스킬 (마크다운 → 블로그 .mdx)

상세 규칙은 반드시 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차 요약이다.

## 절차

1. **소스 확인**: 반영할 초안(md 파일 경로/주제)과 개수를 확인한다. 여러 개면 각각 별도 `.mdx`로 만든다.
   - **소스가 유튜브 영상이면 자막(스크립트)을 받아 내용을 확인한다.** WebFetch로는 유튜브 자막이 안 나오니 `yt-dlp`를 쓴다.
     - 설치(최초 1회): `brew install yt-dlp` (또는 `pip3 install --user yt-dlp`).
     - 자막 받기: `yt-dlp --skip-download --write-auto-sub --write-sub --sub-lang "ko.*,ko,en" --sub-format vtt -o '/tmp/vid.%(ext)s' "<URL>"` → `/tmp/vid.ko-orig.vtt` 등 생성. (영어 자막은 `429`로 실패할 수 있으나 한국어만 있어도 충분.)
     - **멤버십 전용 영상**(로그인 필요)이면 위가 `members-only` 오류로 실패한다. 이때 `--cookies-from-browser chrome`(또는 `safari`/`firefox`/`edge`)를 붙여 **이미 로그인된 브라우저 세션의 쿠키를 재사용**한다. 예: `yt-dlp --cookies-from-browser chrome --skip-download --write-auto-sub --write-sub --sub-lang "ko.*,ko" --sub-format vtt -o '/tmp/vid.%(ext)s' "<URL>"`. 자격증명은 직접 다루지 않고 브라우저 쿠키만 빌린다(사용자가 해당 브라우저에 멤버십으로 로그인돼 있어야 함).
     - VTT 정리: 타임스탬프·`<...>` 인라인 태그·중복 줄을 제거해 순수 텍스트로 만든 뒤(`python3`로 간단히), **앞·중·뒤를 훑어** 실제 다룬 기법·순서·고유 수치를 파악한다.
     - **자막을 그대로 옮기지 말고**(저작권) 내 언어로 요약·재구성한다. 영상이 강조한 핵심 기법을 빠짐없이 반영하고, 인트로에 **원본 영상을 출처로 링크**한다(발표자/채널명도 확인되면 표기). 상세는 [blog-authoring.md](../../wiki/blog-authoring.md) 2절의 "외부 발표·영상 기반" 규칙을 따른다.
     - 자막을 못 받으면 사용자에게 유튜브 "스크립트 표시" 텍스트를 붙여넣어 달라고 요청한다.

2. **파일명·슬러그 결정** (wiki 1절): `blog/YYYY-MM-DD-slug.mdx`, `slug`는 kebab-case. 날짜가 목록 정렬을 결정하니 여러 글이면 날짜/순서를 사용자와 맞춘다.

3. **태그 결정** (wiki 4절): `blog/tags.yml`에 이미 있는 태그만 사용. 새 태그가 필요하면 먼저 `tags.yml`에 추가한 뒤 쓴다. 애매하면 사용자에게 확인.

4. **프론트매터 + truncate 부착** (세부는 wiki 1절):
   - `slug` / `title`(특수문자 있으면 따옴표) / `authors: [ johnycho ]` / `tags: [ ... ]`
   - `<!-- truncate -->` 다음 바로 본문. (첫머리 여백 금지·`@site` import 위치 등은 wiki 1절)

5. **본문 정리** (규칙은 wiki 2·3절을 따른다):
   - 초안 맨 앞 H1(`# 제목`) 한 줄 제거(제목은 프론트매터에). 나머지 본문·코드블록은 유지.
   - **각 섹션의 핵심 한 문장을 `<mark>`로 강조**(섹션당 ~1개).
   - 문체(존댓말)·구체 상황 예시·상호 링크 절제·줄바꿈(`<br />`) 등 본문 규칙은 **wiki 2절**에 정의돼 있으니 그대로 따른다(여기서 재서술하지 않음).

6. **MDX 위험 스캔** (wiki 3절): 코드블록 **밖** 본문에 raw `{` `}` `<태그`(단 `<mark>`,`<br />` 제외)가 없는지 확인. 있으면 이스케이프. 코드블록 안은 그대로 둔다.

7. **검증**: `npm run build` 로 MDX 컴파일 확인. 필요 시 `npm start` 로 렌더 확인.

8. **리뷰(필수)**: 작성·수정 후 반드시 [`blog-review` 스킬](../blog-review/SKILL.md)(`/blog-review`)로 규칙(단어 순화·작성·MDX·다이어그램·코드 정렬·인용) 검토 후 지적 사항을 반영한다.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로 (`gh auth switch --user johnycho`). hook이 자동 검증한다.
