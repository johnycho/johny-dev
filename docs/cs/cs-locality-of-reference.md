---
slug: cs-locality-of-reference
title: 참조 지역성의 원리 (Locality of reference)
tags: [ cs ]
---

## ✔️ 참조 지역성의 원리 (Locality of reference)
CPU가 메모리에 접근할 때 주된 경향을 바탕으로 만들어진 원리며, 주로 <mark>**캐시 메모리의 적중률을 높여 CPU의 메모리 접근 횟수를 줄이는 데 이용**</mark>됩니다.
참조 지역성의 원리는 크게 **시간 지역성**과 **공간 지역성**으로 분류됩니다.

### 시간 지역성 (Temporal locality)
<mark>**CPU는 최근에 접근했던 메모리 공간에 다시 접근하려는 경향**</mark>이 있다는 것을 의미합니다.

### 공간 지역성 (Spatial locality)
<mark>**CPU는 접근한 메모리 공간 근처에 접근하려는 경향**</mark>이 있다는 것을 의미합니다.

프로그래밍에서 지역 변수에 값을 저장하면 나중에 다시 지역 변수에 접근할 가능성이 높은 것이 **시간 지역성**의 예시이며, CPU가 인텔리제이 프로그램을 실행할 때는 인텔리제이 프로그램이 모여 있는 공간 근처를 집중적으로 접근하는 것이 **공간 지역성**의 예시입니다.

## ✔️ 코드 개선 방안 예시
```java
public class LocalityTest {

     @Test
     void test() {
        int size = 10240;
        int[][] array = new int[size][size];

        long beforeTime = System.currentTimeMillis();

        for (int col = 0; col < size; col++) {
            for (int row = 0; row < size; row++) {
                array[row][col]++;
            }
        }

        long afterTime = System.currentTimeMillis();
        long diffTime = afterTime - beforeTime;
       
        System.out.println("수행시간(m) : " + diffTime); // 577ms
    }
}
```
위 코드는 2차원 배열의 열을 먼저 순회하면서 값을 증가하는 프로그램입니다. 자바에서 2차원 배열은 내부적으로는 1차원 배열(`int[]`)에 대한 참조 배열입니다. `array[i]`는 각각 독립된 `int[]` 객체이며, 이들은 <mark>메모리상에 반드시 연속적으로 배치되는 것이 보장되지 않습니다.</mark>

<mark>CPU 캐시는 **공간 지역성 원리**에 근거를 두어 물리적인 메모리 공간상에 인접한 데이터를 미리 캐싱</mark>합니다. 하지만, 열을 먼저 순회하고 행에 접근하게 된다면 물리적인 메모리상에서 멀리 떨어져 있는 데이터를 읽게 되어 캐시 히트율이 떨어집니다. 이 코드를 개선하기 위한 가장 쉬운 방법은 <mark>**행에 먼저 접근하여 캐시 히트율을 높이는 것**</mark>입니다.

```java
public class LocalityTest {

     @Test
     void test() {
        int size = 10240;
        int[][] array = new int[size][size];

        long beforeTime = System.currentTimeMillis();

        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                array[row][col]++;
            }
        }

        long afterTime = System.currentTimeMillis();
        long diffTime = afterTime - beforeTime;
       
        System.out.println("수행시간(m) : " + diffTime); // 28ms
    }
}
```