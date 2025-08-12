---
slug: cs-template-method-pattern
title: 템플릿 메서드 패턴 (Template Method Pattern)
tags: [ cs, design-pattern ]
---

## ✔️ 템플릿 메서드 패턴 (Template Method Pattern)
기능의 뼈대와 구현을 분리하는 행위 디자인 패턴입니다. 템플릿 메서드 패턴은 <mark>실행 단계의 절차를 결정</mark>하는 **상위 클래스**와 <mark>실행 단계를 구현</mark>하는 **하위 클래스**로 구성됩니다.

```java
public abstract class Student {
  
    public abstract void study();
    public abstract void watchYoutube();
    public abstract void sleep();

    // 템플릿 메서드
    final public void doDailyRoutine() {
       study();
       watchYoutube();
       sleep();
    }
}

class BackendStuduent extends Student {

    @Override
    public void study() {
        System.out.println("JPA 강의를 수강합니다.");
    }

    @Override
    public void watchYoutube() {
        System.out.println("유튜브를 시청합니다.");   
    }

    @Override
    public void sleep() {
        System.out.println("잠을 잡니다.");   
    }
}
```
**템플릿 메서드 패턴**은 <mark>공통 로직을 상위 클래스에 모아</mark> 중복 코드를 줄일 수 있으며, 코드의 재사용성을 높일 수 있다는 장점이 있습니다. 하지만, 하위 클래스를 개발할 때 상위 클래스의 내용을 알기 전까지 어떠한 방식으로 동작할지 예측하기 어렵고, 상위 클래스 수정이 발생하는 경우 모든 하위 클래스를 변경해야 하는 단점이 존재합니다.