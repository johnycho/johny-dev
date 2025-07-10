---
slug: cs-page-replacement-algorithms
title: 페이지 교체 알고리즘
tags: [ cs ]
---

## ✔️ 가상 메모리 관리 기법(Virtual Memory Management)
프로그램의 일부만을 메모리에 적재하여 <mark>**실제 사용 가능한 물리 메모리 양보다 큰 프로세스를 실행할 수 있도록 하는 기법**</mark>입니다. 그리고, 가상 메모리 관리 기법 중 하나인 페이징은 메모리의 물리 주소 공간을 프레임 단위로 나눈 이후, 프로세스의 논리 주소 공간을 페이지로 나누어 프레임에 할당하는 방식입니다.

프로세스를 메모리에 적재할 때, 실제로 필요할 때만 페이지를 메모리에 적재하는 것을 요구 페이징(Demand Paging) 이라 하는데요. 요구 페이징을 사용하는 운영체제에서 새로운 페이지를 할당하려고 하는데, 공간이 부족한 경우 메모리에 존재하는 다른 페이지와 신규 페이지를 교체해야합니다. 이때, 교체 대상을 결정하는 방법을 <mark>**페이지 교체 알고리즘(Page Replacement Algorithm)**</mark> 라고 합니다.

## ✔️ 페이지 교체 알고리즘의 종류
대표적인 페이지 교체 알고리즘은 `FIFO`, `OPT`, `LRU`, `LFU`, `NUR`이 존재합니다.

### FIFO 페이지 교체 알고리즘 (First In First Out Page Replacement Algorithm)
적재된 페이지의 순서대로 교체하는 알고리즘입니다. 단순히 먼저 적재되었다는 이유로 교체된다는 비효율을 개선하기 위해 2차 기회 페이지 교체 알고리즘과 같은 변형 알고리즘이 존재합니다.

### OPT 페이지 교체 알고리즘 (Optimal Page Replacement Algorithm)
앞으로 가장 나중에 사용될 페이지를 교체합니다. 하지만, <mark>**페이지의 미래 사용 빈도와 접근 패턴을 알기 어렵기 때문에 이론적 알고리즘으로 분류**</mark>됩니다.

### LRU 페이지 교체 알고리즘 (Least Recently Used Page Replacement Algorithm)
가장 오래 사용되지 않은 페이지를 교체합니다.

### LFU 페이지 교체 알고리즘 (Least Frequently Used Page Replacement Algorithm)
가장 적게 사용된 페이지를 교체합니다. 사용 빈도가 같은 경우에는 다른 페이지 교체 알고리즘을 사용할 수 있습니다.

### NUR 페이지 교체 알고리즘 (Not Used Recently Page Replacement Algorithm)
최근에 사용된 적이 없는 페이지를 교체합니다. `LRU`, `LFU` 알고리즘과 유사한 성능이 보이면서, `LRU`, `LFU`의 메모리 오버헤드를 줄일 수 있습니다. `LRU`와 `LFU`는 페이지에 대한 추가적인 정보(사용 횟수, 마지막 접근 시간)를 관리해야 하는데요. `NUR`은 페이지 테이블 엔트리의 참조 비트와 수정 비트를 활용하여 교체 대상을 결정합니다.

`LRU`, `LFU`, `NUR`, `FIFO`의 변형 알고리즘은 `OPT`와 달리 과거의 데이터를 기반으로 미래의 메모리 접근 패턴을 예측하기 때문에 <mark>**최적 근접 알고리즘으로 분류**</mark>됩니다.