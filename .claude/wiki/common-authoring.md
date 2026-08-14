# Wiki · 공통 작성 규칙 (게시글·wiki 문서 공통)

블로그 게시글([blog-authoring.md](./blog-authoring.md))과 wiki 문서([wiki-authoring.md](./wiki-authoring.md)) **양쪽에 공통**으로 적용되는 규칙을 모아 둔다. 각 문서는 세부 규칙을 여기로 링크한다.

## 1) 코드 예시 — 메서드 체이닝(fluent) 정렬
이어지는 `.`들을 **첫 줄 "마지막 호출"의 `.` 아래**에 세로 정렬한다(문 시작 기준 고정 들여쓰기 X).

- `Caffeine.newBuilder()` → 다음 줄들의 `.`을 `.newBuilder`의 `.` 아래로.
- `o.getItems().stream()` → `.map`·`.reduce`를 첫 줄 마지막 호출인 `.stream`의 `.` 아래로.
- 첫 줄에 `.호출`이 없으면(예: `new StepBuilder(...)`) 첫 체인 호출을 **같은 줄로 올린 뒤**, 그다음부터 그 `.` 아래로 정렬한다.

```java
// 첫 줄 마지막 호출(.newBuilder)의 . 아래로
Caffeine.newBuilder()
        .maximumSize(10_000)
        .build(loader);

// 첫 줄에 .호출이 없으면 첫 체인 호출을 올린 뒤 정렬
new StepBuilder("transitionStep", jobRepository).<Long, Long>chunk(CHUNK, txManager)
                                                .reader(reader)
                                                .build();
```
