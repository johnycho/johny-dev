---
slug: java-threadlocal
title: ThreadLocal 이란?
tags: [ java, spring ]
---

## ✔️ `ThreadLocal` 이란?
`Java`에서 각 스레드마다 독립적인 변수를 저장할 수 있도록 도와주는 클래스입니다. 보통 여러 스레드가 공유 자원을 사용하면 동시성 문제가 발생할 수 있는데, `ThreadLocal`을 사용하면 스레드 별로 데이터를 분리할 수 있어 동기화 없이 안전하게 활용할 수 있습니다. 각 스레드는 자신만의 `ThreadLocalMap`을 가지고 있고 <mark>**`ThreadLocal`을 키로 사용하여 값을 저장**</mark>합니다. 즉, 하나의 스레드에서 여러 개의 `ThreadLocal`을 사용할 수 있으며, `ThreadLocal`은 현재 스레드의 `ThreadLocalMap`을 제어하는 역할을 합니다.

`Spring` 생태계에서는 `ThreadLocal`을 사용하여 트랜잭션 동기화 관리(`TransactionSynchronizationManager`), 사용자 인증 정보 관리(`SecurityContextHolder`), 웹 요청의 `attribute` 관리(`RequestContextHolder`) 등의 기능을 제공하고 있습니다.

## ✔️ `ThreadLocal`의 장점
각 스레드는 `ThreadLocal`에 접근할 때 다른 스레드와 격리된 값을 가질 수 있습니다. 그리고 공유 자원이 없기 때문에 `synchronized` 키워드 등을 사용해서 동기화할 필요가 없습니다.

## ✔️ `ThreadLocal`을 사용할 때 주의할 점
스레드풀을 사용하면 스레드가 재사용됩니다. 이때 `ThreadLocal`에 이전 스레드의 값이 남아있으면 재사용된 스레드가 올바르지 않은 데이터를 참조할 수 있습니다. 이를 방지하려면 스레드가 끝나는 시점에 `remove()` 메서드를 호출하여 `ThreadLocal`에 저장된 값을 제거해야 합니다.

비동기 작업을 수행할 때 `ThreadLocal`이 예상대로 동작하지 않을 수 있습니다. 예를 들어, `@Async` 어노테이션을 사용하면 새로운 스레드에서 비동기 작업이 실행되는데, <mark>**비동기 스레드는 기존 스레드에서 `ThreadLocal`에 저장한 값을 참조할 수 없습니다.**</mark> 이 문제는 `Spring 4.3` 이상에서 제공하는 `TaskDecorator`를 사용하여 기존 스레드의 `ThreadLocal` 값을 비동기 스레드에 복사하는 방식으로 해결할 수 있습니다.

## ✔️ `ThreadLocal`을 대체할 수 있는 방법
`ThreadLocal` 대신 메서드 인자로 값을 전달하거나 `ConcurrentHashMap`과 같이 thread-safe한 자료구조를 사용하는 방법이 있습니다. `Spring`에서는 `@RequestScope` 어노테이션을 사용하여 `HTTP` 요청 별로 데이터를 관리할 수 있습니다.

## ✔️ `NamedThreadLocal`란?
`NamedThreadLocal`은 `Spring`에서 제공하는 `ThreadLocal`의 확장 클래스로, <mark>**디버깅을 쉽게 하기 위해 이름을 부여할 수 있도록 설계**</mark>되었습니다. 기본적인 기능은 `ThreadLocal`과 같지만, 여러 개의 `ThreadLocal`을 사용할 때 이름을 명확히 설정하면 어떤 목적의 `ThreadLocal`인지 구분할 수 있어 디버깅이 용이합니다.

```java
// 일반 ThreadLocal
ThreadLocal<String> userContext = new ThreadLocal<>();

// NamedThreadLocal
ThreadLocal<String> userContext = new NamedThreadLocal<>("User Context");
```
### toString() 결과
* ThreadLocal
> java.lang.ThreadLocal@3f99bd52
* NamedThreadLocal
> User Context