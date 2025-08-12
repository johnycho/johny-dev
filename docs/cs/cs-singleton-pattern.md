---
slug: cs-singleton-pattern
title: 싱글턴 패턴 (Singleton Pattern)
tags: [ cs, design-pattern ]
---

## ✔️ 싱글턴 패턴 (Singleton Pattern)
생성자를 여러 차례 호출해도 실제로 생성되는 객체를 하나로 유지하는 것을 의미합니다. 객체가 최초로 생성된 이후에 생성자나 객체 생성 메서드는 기존에 만들어진 객체를 반환합니다.
```java
public class Singleton {

  private static final Singleton INSTANCE = new Singleton();

  // 생성자는 외부에서 호출못하게 private 으로 지정해야 한다.
  private Singleton() { ... }

  public static Singleton getInstance() {
    return INSTANCE;
  }
}
```

## ✔️ 싱글턴 패턴의 장단점
### 장점
* 하나의 객체를 여러 상황에서 재사용할 수 있기 때문에 메모리 낭비를 방지할 수 있습니다.
* 여러 다른 객체가 하나의 인스턴스에 쉽게 접근할 수 있어 편리합니다.

### 단점
전역 객체를 생성한다는 특성상 코드의 복잡도를 높이고, 테스트하기 어려운 코드를 만들 수 있습니다.
* 상황에 따라 더욱 복잡한 구현이 필요할 수 있습니다. 예를 들어, 싱글턴 객체를 지연 초기화(lazy initialization) 하고 싶을 때 여러 스레드가 동시에 생성자에 접근하면 두 개 이상의 객체가 생성될 수 있으므로 동시성 문제를 고려해야 합니다.
* 테스트에서는 싱글턴 객체의 상태를 초기화하는 과정이 필요합니다. 예를 들어, 1번 테스트에서 싱글턴 객체를 수정한 경우, 2번 테스트는 싱글턴의 상태를 초기화한 후 테스트를 실행해야 합니다.
* 싱글턴 객체가 인터페이스를 구현하지 않은 경우, 테스트 환경에서 가짜 구현체로 대체하여 주입하기 어렵습니다.