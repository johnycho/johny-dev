---
slug: java-threadpool-saturation-policies
title: 스레드 풀 포화 정책 (Saturation Policies)
tags: [ java ]
---

자바의 `ThreadPoolExecutor`를 기준으로 설명하겠습니다. 스레드 풀 포화 정책(Saturation Policies) 이란, 말 그대로 스레드 풀이 포화 상태인 경우의 행동을 결정하는 정책을 의미합니다. `ThreadPoolExecutor` 설정에는 상시 유지하는 스레드의 수인 `corePoolSize`, 작업 대기열 크기인 `workQueueSize`, 스레드를 추가할 수 있는 최대 수인 `maxPoolSize`가 존재하는데요. <mark>**스레드가 `maxPoolSize`까지 늘어나고 대기열까지 꽉 찬 상태를 포화 상태**</mark>라고 합니다. 이때 새로운 작업 요청이 들어오면, `RejectedExecutionHandler`의 구현체인 포화 정책이 실행됩니다.

## ✔️ 포화 정책의 종류
포화 정책 종류는 `RejectedExecutionHandler`의 구현체를 기준으로 `AbortPolicy`, `CallerRunsPolicy`, `DiscardOldestPolicy`, `DiscardPolicy`가 존재합니다.

기본적으로 제공되는 포화 정책은 4가지지만, 직접 `RejectedExecutionHandler` 인터페이스를 구현하여 커스텀 포화 정책을 만들 수 있습니다.
```java
class CustomPolicy implements RejectedExecutionHandler {

    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        // ... 중략
    }
}
```

### AbortPolicy
포화 상태일 경우, `RejectedExecutionException`을 발생시킵니다.

### DiscardPolicy
포화 상태일 경우, 신규 요청을 무시합니다.

### DiscardOldestPolicy
포화 상태일 경우, 작업 대기열에서 가장 오래된 요청을 버리고 신규 요청을 대기열에 추가합니다.

### CallerRunsPolicy
포화 상태일 경우, 요청 스레드에서 해당 작업을 실행합니다.