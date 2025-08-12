---
slug: spring-exception-handler
title: '@ExceptionHandler 어노테이션'
tags: [ spring ]
---

`@ExceptionHandler` 어노테이션은 `Spring MVC`에서 컨트롤러(`@Controller`)나 전역 예외 처리를 위한 `@ControllerAdvice` 클래스의 메서드에서 발생하는 예외를 처리하는 데 사용되는데요. 이 어노테이션은 특정 예외를 처리하는 메서드를 지정하거나 메서드의 파라미터로 처리할 예외를 설정할 수 있습니다.

## ✔️ `@ExceptionHandler` 동작 방식
`Spring MVC` 애플리케이션에서 예외가 발생하면, `DispatcherServlet`이 적절한 `HandlerExceptionResolver`를 찾아 예외를 처리합니다. Spring에 기본적으로 등록된 `HandlerExceptionResolver`는 세 가지가 있으며, 각 리졸버는 우선 순위에 따라 예외를 처리합니다.

### 1. `ExceptionHandlerExceptionResolver`
`@ExceptionHandler` 어노테이션이 붙은 메서드를 찾아 예외를 처리합니다.
```java
@Controller
public class MyController {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
```

### 2. `ResponseStatusExceptionResolver`
예외 클래스나 메서드에 붙은 `@ResponseStatus` 어노테이션을 해석해서 `HTTP` 상태 코드를 설정합니다.
```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {}
```

### 3. `DefaultHandlerExceptionResolver`
스프링 내부에서 발생하는 표준 스프링 예외(`HttpRequestMethodNotSupportedException`, `HttpMediaTypeNotSupportedException` 등)를 `HTTP` 상태 코드로 변환.
> HttpRequestMethodNotSupportedException → 405 Method Not Allowed  
> HttpMediaTypeNotSupportedException → 415 Unsupported Media Type

위 세가지 중 <mark>**`ExceptionHandlerExceptionResolver`가 가장 먼저 동작하며, 발생한 예외가 `@ExceptionHandler`에 등록되어 있는지 확인**</mark>합니다. 만약 처리할 수 없는 예외라면 다음 리졸버로 넘어갑니다. `ExceptionHandlerExceptionResolver`의 특징은 예외가 `WAS`로 던져지지 않고 직접 처리된다는 것입니다.

이렇게 함으로써 예외가 발생했을 때 적절한 방법으로 처리되어 사용자에게 친화적인 에러 메시지를 제공하거나 로깅 등의 추가 작업을 수행할 수 있습니다.