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
애플리케이션이 실행되는 동안  
Old Region을 하나씩 살펴보며 다음을 계산합니다.
- 살아있는 객체 비율
- 쓰레기(Garbage) 비율

중요한 점:
- 대부분 **애플리케이션과 동시에 실행**
- 중간에 아주 짧은 `STW`만 발생

👉 이 단계는 “치우는 단계”가 아니라 **“어디를 치울지 정하는 단계”** 입니다.

---

## 5. `Mixed GC` – `G1GC`의 핵심

`Concurrent Marking`이 끝나면,  
드디어 `G1GC` 이름의 의미가 드러납니다.

### `Mixed GC`란?
Young Region + **Garbage가 많은 Old Region 일부**를 함께 회수하는 GC

### 왜 “Garbage-First”인가?
Old Region 중에서도, 다음 기준에 해당하는 리전을 **우선적으로(Garbage-First)** 수집하기 때문입니다.
- 쓰레기(Garbage)가 많고
- 적은 비용으로 많은 메모리를 회수할 수 있는 곳

---

## 6. Pause Time을 어떻게 관리할까?

`G1GC`의 중요한 목표는
> “GC로 인한 멈춤 시간을 **예측 가능하게 만들자**”

이므로, 다음과 같은 옵션을 제공합니다.

```bash
-XX:MaxGCPauseMillis=200
```
- “한 번의 GC는 200ms 이내로 끝내자”는 목표값
- `G1GC`는 이 목표에 맞춰
- 한 번에 수집할 Region 개수를 자동으로 조절

👉 한 번에 다 치우지 않고 조금씩 나눠서 치움

---

## 7. Full GC는 언제 발생할까? (가능하면 피한다)

`G1GC`도 다음 상황에서는 Full GC가 발생할 수 있습니다.
- 객체를 옮길 빈 Region이 부족할 때
- Old 영역 증가 속도를 GC가 따라가지 못할 때
- 매우 큰 객체(Humongous Object)가 많을 때

👉 운영 환경에서 Full GC는 반드시 원인 분석 대상입니다.

---

## 8. G1GC 전체 흐름 요약
> 객체 생성 → Eden  
> Eden 가득 → Young GC  
> 오래 생존 → Old  
> Old 커짐 → Concurrent Marking  
> 쓰레기 많은 곳 → Mixed GC  
> (Full GC는 최대한 회피)

---

## 9. 실무에서 많이 넣는 GC 튜닝 옵션(설정값)
### 실무 공통
- 힙 사이징
```shell
-Xms4g -Xmx4g
```
- GC 로그 (무조건)
```shell
-Xlog:gc*,safepoint:file=/var/log/gc.log:time,uptime,level,tags
```

- OOM 진단
```shell
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/heapdump.hprof
-XX:ErrorFile=/var/log/hs_err_pid%p.log
```

### `G1GC`에서 자주 만지는 튜닝 옵션
- 목표 pause 시간(soft goal)
```shell
-XX:MaxGCPauseMillis=200
```
너무 낮추면 CPU/처리량 희생 가능

- 마킹 시작 시점(`IHOP`)
```shell
-XX:InitiatingHeapOccupancyPercent=45
```
Old가 빨리 차서 Mixed/FullGC 위험이면 더 낮춰서 일찍 마킹 유도

- 스레드 수(환경 따라)
```shell
-XX:ParallelGCThreads=8
-XX:ConcGCThreads=2
```
CPU 코어/컨테이너 제한 있을 때 조정 (과다하면 앱 CPU 잠식)

- 큰 객체/Region 관련(가끔)
```shell
-XX:G1HeapRegionSize=8m
```
기본 자동이 대부분 정답이라 특수 케이스에서만 조정

---

G1GC는 힙을 잘게 나눠  
쓰레기가 많은 영역부터 조금씩 치우며  
멈춤 시간을 관리하는 GC입니다.

G1GC는 “한 번에 다 치우는 GC”가 아니라  
“조금씩, 예측 가능하게 치우는 GC”입니다.

그래서:
- 대용량 힙
- 서버 애플리케이션
- Java 17·21 환경

에서 기본 GC로 사용되고 있습니다.