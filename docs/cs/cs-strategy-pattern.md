---
slug: cs-strategy-pattern
title: 전략 패턴 (Strategy Pattern)
tags: [ cs, java ]
---

<mark>**전략 패턴(Strategy Pattern)**</mark>은 객체의 행위를 동적으로 변경하고 싶은 경우, 코드를 직접 수정하는 것이 아닌 <mark>**추상화된 전략의 구현만을 바꿔 객체의 행위를 변경하는 디자인 패턴**</mark>입니다. 자바 언어의 요소와 함께 설명해 드리자면, 객체의 행위를 Interface로 정의하고, Interface의 메서드를 구현하는 구현체들을 주입하는 것이 전략 패턴의 대표적인 형태입니다.

```java
class Car {

    private final MoveStrategy strategy;
    private final int position;
   
    public Car(MoveStrategy strategy, int position) {
        this.strategy = strategy;
        this.position = position;
    }

    public Car move(int input) {
        if(strategy.isMovable(input)) {
            return new Car(strategy, car + 1);
        }

        return this;
    }
}

interface MoveStrategy {
    boolean isMovable(int input);
}

class EvenNumberMoveStrategy implements MoveStrategy {

    @Override
    public boolean isMovable(int input) {
        return (input % 2) == 0;
    }
}

class OddNumberMoveStrategy implements MoveStrategy { ... }

class PrimeNumberMoceStrategy implements MoveStrategy { ... }
```
주어진 숫자에 따라서 자동차의 움직임을 결정하는 요구사항이 존재하는 경우, 위 예시처럼 MoveStrategy 타입 필드를 선언하고 외부에서 이를 구현한 전략을 주입받도록 구현하면 유연하게 자동차의 움직임 전략을 교체할 수 있습니다.