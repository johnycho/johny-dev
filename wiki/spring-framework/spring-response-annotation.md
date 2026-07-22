---
slug: spring-response-annotation
title: '@ResponseBody와 ResponseEntity<T>'
tags: [ spring ]
---

## ✔️ `@ResponseBody`(or `ResponseEntity<T>`)가 있을 때와 없을 때 차이점
`@ResponseBody` 혹은 `ResponseEntity<T>` 반환을 사용한다면, 스프링은 컨트롤러에서 반환된 값을 `HTTP` 응답 본문에 직접 씁니다. 이때 자바 객체를 자동으로 `JSON`이나 `XML` 등의 타입으로 직렬화합니다. 만약, <mark>**없는 경우에는 스프링은 반환값을 뷰 이름으로 해석**</mark>합니다. 뷰 이름으로 해석한 이후에, 뷰 리졸버를 사용해 뷰를 찾고 응답합니다.(뷰에 전달할 모델이 있다면, 이를 뷰에 전달하고 응답합니다.)

## ✔️ `@ResponseBody`와 `ResponseEntity<T>` 반환 차이
### `@ResponseBody`
반환값을 `HTTP` 응답 본문(body)에 그대로 쓰기 때문에, 코드를 간결하게 유지할 수 있습니다. 하지만, 상태 코드와 헤더를 유연하게 변경하기는 어렵습니다.(<mark>**항상 200 OK + 기본 헤더**</mark>)
```java
@RestController
@RequestMapping("/api")
public class SampleController {

    // 문자열 그대로 응답 (HTTP 200 OK)
    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello World";
    }

    // JSON 객체 응답 (HTTP 200 OK)
    @GetMapping("/user")
    @ResponseBody
    public UserDto getUser() {
        return new UserDto("John", 30);
    }

    record UserDto(String name, int age) {}
}
```

### `ResponseEntity<T>`
본문, 상태 코드, 헤더를 유연하게 변경할 수 있어 `REST API`에서 세밀한 응답 제어가 필요할 때 유용하지만, 작성할 코드량이 증가한다는 단점이 있습니다.
```java
@RestController
@RequestMapping("/api")
public class SampleController2 {

    // 상태 코드 지정
    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.status(HttpStatus.CREATED) // 201 Created
                             .body("Hello World");
    }

    // 헤더 + JSON 응답
    @GetMapping("/user")
    public ResponseEntity<UserDto> getUser() {
        return ResponseEntity.ok()
                             .header("X-Custom-Header", "CustomValue")
                             .body(new UserDto("John", 30));
    }

    record UserDto(String name, int age) {}
}
```