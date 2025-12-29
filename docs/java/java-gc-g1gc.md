---
slug: java-gc-g1gc
title: G1(Garbage-First) GC 동작 과정
tags: [ java ]
---

Java 17·21의 기본 GC인 **G1GC(Garbage-First Garbage Collector)** 는  
“<mark>힙을 잘게 나누고, 쓰레기가 많은 곳부터 조금씩 치운다</mark>”는 개념으로 설계된 GC입니다.

---

## G1GC 한 줄 요약
> **G1GC는 힙을 Region 단위로 나누고,  
> Garbage(쓰레기)가 많은 Region부터 우선적으로 수집해  
> 멈춤 시간을 예측 가능하게 만드는 GC입니다.**

---

## 1. G1GC는 힙을 이렇게 나눈다

기존 GC는 힙을 크게 **Young / Old** 영역으로 나눠 관리했지만,  
G1GC는 힙을 **같은 크기의 작은 조각(Region)** 으로 나눕니다.

> Heap = [Region][Region][Region][Region]...

- Region 크기: 보통 1~32MB
- 각 Region은 상황에 따라 역할이 바뀜
    - Eden
    - Survivor
    - Old

👉 **Region은 고정 역할이 아니라 동적으로 역할이 바뀐다**는 점이 핵심입니다.

---

## 2. 객체는 어디에 생성될까? (Eden Region)

새로 생성되는 객체는 대부분 **Eden Region**에 할당됩니다.

### Eden이 가득 차면?
- **Young GC 발생**
- 아주 짧은 **Stop-The-World(STW)** 발생
- 살아있는 객체만 골라:
    - Survivor 또는 Old Region으로 이동
- Eden Region은 통째로 비워서 재사용

👉 복사(Evacuation) 방식이라 **빠르고 단편화가 적음**

---

## 3. 객체가 오래 살아남으면? (Old Region)

Young GC를 여러 번 버틴 객체는 **Old Region**으로 이동합니다.

문제는 Old가 커질수록,
> “어디부터 치워야 효율적일까?”  
를 판단해야 한다는 점입니다.

---

## 4. `Concurrent Marking` (조사 단계)

Old 영역이 일정 수준 이상 차면,  
`G1GC`는 `Concurrent Marking` 단계를 시작합니다.

### 이 단계에서 하는 일
- 애플리케이션이 실행되는 동안
- Old Region을 하나씩 살펴보며
    - 살아있는 객체 비율
    - 쓰레기(Garbage) 비율
- 을 계산합니다.

중요한 점:
- 대부분 **애플리케이션과 동시에 실행**
- 중간에 아주 짧은 `STW`만 발생

👉 이 단계는 “치우는 단계”가 아니라 **“어디를 치울지 정하는 단계”** 입니다.

---

## 5. `Mixed GC` – `G1GC`의 핵심 ⭐

`Concurrent Marking`이 끝나면,  
드디어 `G1GC` 이름의 의미가 드러납니다.

### `Mixed GC`란?
Young Region + **Garbage가 많은 Old Region 일부**를 함께 회수하는 GC

### 왜 “Garbage-First”인가?
- Old Region 중에서도
    - 쓰레기가 많고
    - 적은 비용으로 많은 메모리를 회수할 수 있는 곳
- 부터 **우선적으로(Garbage-First)** 수집하기 때문입니다.

---

## 6. Pause Time을 어떻게 관리할까?

G1GC의 중요한 목표는
> “GC로 인한 멈춤 시간을 **예측 가능하게 만들자**”

이므로, 다음과 같은 옵션을 제공합니다.

```bash
-XX:MaxGCPauseMillis=200
```
- “한 번의 GC는 200ms 이내로 끝내자”는 목표값
- `G1GC`는 이 목표에 맞춰
- 한 번에 수집할 Region 개수를 자동으로 조절

👉 한 번에 다 치우지 않고 조금씩 나눠서 치움