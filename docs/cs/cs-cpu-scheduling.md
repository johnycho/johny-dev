---
slug: cs-cpu-scheduling
title: CPU 스케줄링
tags: [ cs ]
---

CPU 스케줄링은 운영체제가 프로세스들에게 공정하고 합리적으로 CPU 자원을 배분하는 것을 의미합니다. 만약 CPU 스케줄링이 없다면, 반드시 실행되어야 할 프로세스들이 실행되지 못할 수 있으며, 당장 급하지 않은 프로세스가 실행되는 등 무질서한 상태가 발생할 수 있습니다. CPU 스케줄링은 선점형과 비선점형 방식으로 구현할 수 있으며, 다양한 스케줄링 알고리즘이 존재합니다.

## ✔️ 선점형 스케줄링 (Preemptive Scheduling)
프로세스가 CPU를 사용하고 있더라도 운영체제가 프로세스로부터 자원을 강제로 빼앗아 다른 프로세스에 할당할 수 있는 방식입니다. 해당 방식은 응답 시간이 낮으며, 효율적이지만 컨텍스트 스위칭 오버헤드가 발생할 수 있으며 경쟁 상태가 발생할 수 있습니다.

### 1) 라운드 로빈 스케줄링 (RR, Round Robin Scheduling)
선입 선처리 스케줄링에 타임 슬라이스(각 프로세스가 CPU를 사용할 수 있는 정해진 시간) 개념이 추가된 방식입니다. 라운드 로빈 방식은 정해진 타임 슬라이스만큼의 시간 동안 돌아가며 CPU를 이용한 선점형 스케줄링 방식입니다. 타임 슬라이스의 크기가 크다면 선입 선출과 비슷해져 호위 효과가 발생할 수 있으며, 너무 작은 경우에는 문맥 교환 비용이 커질 수 있습니다.

### 2) 최소 잔여 시간 우선 스케줄링 (SRTF, Shortest Remaininng Time First Scheduling)
최단 작업 우선(SJF)에 선점형 스케줄링을 혼합한 방식입니다. 프로세스가 실행되는 도중 실행 시간이 짧은 프로세스가 추가되면 현재 실행되는 프로세스를 중단하고 해당 프로세스에게 CPU를 할당합니다.

### 3) 다단계 큐 스케줄링 (Multilevel Queue Scheduling)
다양한 프로세스 유형(예: 시스템, 인터랙티브, 배치 작업 등)을 우선 순위별로 여러개의 분리된 큐에 나누어 관리하며, 우선순위가 높은 큐에 있는 프로세스들을 먼저 처리하고, 우선순위가 가장 높은 큐가 비어 있다면, 그 다음 우선순위 큐의 프로세스들을 처리합니다.
우선순위가 높은 큐에 새로운 프로세스가 들어오면, 실행 중인 낮은 우선순위 프로세스를 선점하여 중단시킬 수 있으므로, 선점형 스케줄링의 특성을 가집니다.

각 큐는 고정된 우선순위를 가지며, 큐 내부의 스케줄링 방식(Round Robin, FCFS 등)은 독립적으로 설정할 수 있습니다.  
→ 큐 간은 선점형, 큐 내부는 선점형/비선점형 모두 가능

## ✔️ 비선점형 스케줄링 (Non-preemptive Scheduling)
하나의 프로세스가 자원을 사용하고 있다면 해당 프로세스가 종료되거나 스스로 대기 상태로 전환되기 전까지 다른 프로세스가 자원을 점유할 수 없는 스케줄링 방식을 의미합니다. 컨텍스트 스위칭 비용이 상대적으로 적지만, 응답 시간이 길 수 있습니다.

### 1) 선입 선처리 스케줄링 (FCFS, First Come First Served Scheduling)
준비 큐에 삽입된 순서대로 프로세스들을 처리하는 비선점형 스케줄링 방식입니다. 공정해보이지만, <mark>**호위효과(Convoy Effect)**</mark>가 발생할 수 있다는 점에서 부작용이 존재합니다. 예를 들어, 준비 큐에 A(실행 시간 10ms), B(실행 시간 5ms), C(실행 시간 2ms)이 순서대로 존재할 때, C 프로세스는 2ms를 실행하기 위해서 15ms를 기다려야 합니다.

### 2) 최단 작업 우선 스케줄링 (SJF, Shortest Job First Scheduling)
준비 큐에 삽입된 프로세스들 중에서 CPU 이용 시간이 가장 짧은 프로세스부터 실행되는 비선점형 스케줄링 방식입니다. 호위효과(Convoy Effect)를 방지하고, 평균 대기 시간이 짧다는 이점이 존재합니다. 하지만, CPU 실행 시간이 긴 프로세스는 기아 현상(Starvation) 발생할 가능성이 존재합니다. 기아 현상은 프로세스가 자원을 할당받지 못하고 무한정 준비 큐에 존재하게 되는 상황을 의미합니다.

## ✔️ 우선 순위가 존재하는 스케줄링은 기아 현상이 발생할 텐데, 어떻게 해결할 수 있을까? 🤔
최단 작업 우선(SJF), 최소 잔여 시간(SRT)이나 다단계 큐 스케줄링은 일종의 우선 순위 스케줄링이며, 말씀 주신 기아 현상이 발생할 수 있습니다. 기아 현상을 방지하기 위해서는 대표적으로 에이징 기법이 존재합니다. 에이징(Aging) 이란 오랫동안 대기한 프로세스의 우선순위를 점차 높이는 방식입니다.

예를 들어, 다단계 큐 스케줄링 (Multilevel Queue Scheduling)의 기아 현상 문제를 해결하기 위해서 에이징 기법이 적용된 <mark>**다단계 피드백 큐 스케줄링(Multilevel Feedback Queue Scheduling)**</mark> 방식이 존재하는데요. 해당 방식은 새로 준비 상태가 된 프로세스가 있다면, 우선순위가 가장 높은 우선순위 큐에 삽입되고 타임 슬라이스 동안 실행됩니다. 만약, 해당 큐에서 실행이 끝나지 않는다면 프로세스는 다음 우선순위 큐에 삽입됩니다.(결국 CPU를 오래 사용해야 하는 프로세스는 점차 우선순위가 낮아집니다.) 만약 우선순위가 낮은 큐에서 너무 오래 기다리고 있는 프로세스가 있다면 점차 우선순위가 높은 큐로 이동시키는 에이징 기법을 적용해 기아 현상을 예방합니다.