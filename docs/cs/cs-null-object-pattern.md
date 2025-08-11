---
slug: cs-null-object-pattern
title: 널 오브젝트 패턴 (Null Object Pattern)
tags: [ cs ]
---

## ✔️ 널 오브젝트 패턴(Null Object Pattern)
객체가 존재하지 않을 때, 널을 전달하는 것이 아닌 아무 일도 하지 않는 객체를 전달하는 기법입니다.

```java
public void doSomething(MyObject obj) {
  if(obj == null) {
    throw new Exception();
  }

  obj.doMethod();
}
```
이러한 유형의 코드가 여러 곳에서 계속 반복해서 등장하게 된다면 코드를 복잡하게 만들 수도 있습니다. 널 오브젝트 패턴은 널 값을 아무런 행위도 하지 않는 객체로 다뤄 널 체크 코드를 간소화합니다.

```java
class MyNullObject implements MyObject {

  @Override
  public void doMethod() {
    // 아무것도 하지 않음
  }
}

class MyRealObject implements MyObject {

  @Override
  public void doMethod() {
      System.out.println("무엇인가 수행합니다.")
  }
}

public void doSomething(MyObject obj) {
  obj.doMethod();
}
```

값이 널인 경우에만 사용되는 것이 아닌 특별한 케이스에서 모두 응용할 수 있습니다. 가령, 스택이라는 자료구조를 만들 때 용량이 0인 경우, ZeroCapacityStack을 만들 수 있습니다. 널 오브젝트 패턴은 반복적인 널 체크 코드를 간소화하고 협력을 재사용하는데 용이하다는 장점이 있지만, 오히려 <mark>**예외를 탐지하기 어려운 상황을 만들 수 있습니다.**</mark>