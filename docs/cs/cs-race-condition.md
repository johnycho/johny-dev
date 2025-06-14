---
slug: cs-race-condition
title: 경쟁 상태 (Race Condition)
tags: [ cs, java ]
---

**경쟁 상태(Race Condition)** 는 두 개 이상의 스레드가 공유 자원에 동시에 접근할 때 스레드 간의 실행 순서에 따라 결과가 달라지는 현상으로, 원자성과 가시성 모두 보장되어야 해결할 수 있습니다.

## ✔️ 원자성 (Atomicity)
공유 자원에 대한 작업의 단위가 더 이상 쪼갤 수 없는 하나의 연산처럼 동작하는 성질을 의미합니다.

## 원자성을 보장하지 않으면 어떤 문제가 발생할까?
예를 들어 `i++` 연산은 하나의 문장이지만 CPU가 이를 수행하려면 세 단계의 instruction으로 분리됩니다.

`i` 변수의 기존 값을 읽음 (Read)
기존 값에 1을 더함 (Modify)
결과 값을 다시 `i` 변수에 할당 (Write)
연산 사이에 다른 스레드가 개입하면 기대하지 않은 결과가 발생할 수 있습니다.

![Atomicity](img/atomicity.png)

만약 두 개의 스레드가 동시에 i++ 연산을 수행할 때, Thread 1이 i + 1을 하기 전에 Thread 2가 i를 읽어서 i + 1을 수행한 후 반영하면 Thread 2의 연산은 무시됩니다.

## ✔️ 가시성 (Visibility)
한 스레드에서 변경한 값이 다른 스레드에서 즉시 확인 가능한 성질을 의미합니다.

### 가시성을 보장하지 않으면 어떤 문제가 발생할까?
![Visibility](img/visibility.png)

현대의 컴퓨터는 여러 개의 CPU 코어가 있고 각 코어마다 CPU 캐시가 존재하는데요. 한 스레드에서 공유 자원을 변경할 경우 메인 메모리에서 CPU 캐시로 값을 읽어들인 후, 변경된 값을 자신의 CPU 캐시에 반영합니다. 하지만 변경된 값이 메인 메모리에 언제 반영될지 알 수 없기 때문에 다른 스레드가 공유 자원을 읽을 때 변경 사항을 즉시 확인할 수 없습니다.

## ✔️ java에서 원자성과 가시성을 보장하기 위해 어떤 방법을 사용할 수 있을까?
<mark>**원자성과 가시성을 모두 보장**</mark>하려면 `synchronized` 키워드, CAS(Compare-And-Swap) 알고리즘을 사용하는 `Atomic` 클래스, `ReentrantLock`과 같은 lock 클래스, `Concurrent Collections` 등을 사용해서 동기화할 수 있습니다.

<mark>**가시성만 보장**</mark>하려면 `volatile` 키워드로 <mark>**CPU 캐시를 사용하지 않고 메인 메모리에서 공유 자원을 직접 읽거나 쓸 수 있습니다.**</mark> 이 때 하나의 스레드에서만 쓰기 작업을 수행하고, 나머지 스레드는 읽기 작업만 수행해야 합니다.