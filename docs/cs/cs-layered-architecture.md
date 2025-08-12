---
slug: cs-layered-architecture
title: 레이어드 아키텍처 (Layered Architecture)
tags: [ cs, design-pattern ]
---

## ✔️ 레이어드 아키텍처 (Layered Architecture)
소프트웨어를 관심사별로 여러 계층으로 나누어 수직적으로 배열한 것을 의미합니다. 여기서 <mark>**관심사란 유사한 책임들을 의미**</mark>합니다. 예를 들어, 데이터베이스 접근과 관련된 책임들을 하나의 관심사로 볼 수 있습니다.

레이어드 아키텍처의 대표적인 구성에는 3가지 레이어가 존재하는데요. 표현 계층, 도메인 계층, 데이터 소스 계층이 이에 해당합니다. 레이어의 종류와 수는 프로젝트 상황마다 달라질 수 있습니다.

### 표현 계층 (Presentation Layer)
사용자 입력을 처리하기 위해 존재합니다.
### 도메인 계층 (Domain Layer)
비즈니스와 관련된 로직을 수행하기 위해 존재합니다.
### 데이터 소스 계층 (Data Source Layer)
데이터베이스 접근 및 데이터 조작과 관련된 작업을 수행하기 위해 존재합니다.

## ✔️ 싱크홀 안티 패턴 (Achitecture Sinkhole Anti-Pattern)
일반적으로 레이어드 아키텍처에서 요청은 상위 레이어(표현 계층)에서 중간 레이어를 거쳐 하위 레이어(데이터 소스 계층)로 전달되는데요. 이때, <mark>**중간 레이어는 아무 일도 하지 않음에도 불구하고 요청을 무작정 중간 레이어를 통과시키는 것**</mark>을 **싱크홀 안티 패턴(Achitecture Sinkhole Anti-Pattern)** 이라고 합니다. 이는 불필요하게 요청을 전달받고, 다시 전달만 하는 중간 코드를 작성하고, CPU 및 메모리 자원을 낭비한다는 문제가 있습니다.
```java
@Service
public class OrderService {

  private OrderDao orderDao;

  // 아무 일도 수행하지 않음
  public OrderResponse getOrder(Long orderId) {
      return orderDao.getOrderById(orderId);
  }
}
```
하지만 이를 무조건 피해야 하는 것은 아닙니다. 상위 레이어가 직접 하위 레이어에 접근하는 방식을 허용하면 일관성이 약해져 추가적인 소통과 문서가 필요할 수 있기 때문입니다.
따라서, 프로젝트와 팀의 상황에 맞게 트레이드 오프를 고려하여 팀만의 규칙을 만드는 것이 중요합니다.