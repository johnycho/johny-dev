---
slug: spring-transactional-aop
title: '@Transactional 어노테이션 AOP 동작 흐름'
tags: [ spring, jpa ]
---

`@Transactional` 어노테이션을 사용한 선언적 트랜잭션 관리(Declarative Transaction Management)의 전체 흐름에는 크게 3가지 요소가 등장합니다. `트랜잭션 매니저`, `트랜잭션 AOP 프록시`, `트랜잭션 동기화 매니저`가 이에 해당됩니다.

클라이언트 코드로부터 요청이 들어오면 `트랜잭션 AOP 프록시`가 `트랜잭션 매니저`를 획득하고, 트랜잭션을 시작하기 위해서 `트랜잭션 매니저`에게 요청합니다. 트랜잭션 시작 요청 받은 `트랜잭션 매니저`는 데이터 소스를 통해 커넥션을 받아오고 트랜잭션을 시작합니다. 그리고, `트랜잭션 매니저`는 트랜잭션이 시작된 커넥션을 `트랜잭션 동기화 매니저`에 보관합니다. 이후 트랜잭션이 종료되는 경우, `트랜잭션 매니저`는 `트랜잭션 동기화 매니저`에 보관한 커넥션을 가져와 트랜잭션을 종료하고 커넥션을 반환하거나 종료합니다.

## ✔️ 트랜잭션 매니저 (Transaction Manager)
JDBC를 사용한 트랜잭션 관리 코드와 JPA를 사용한 트랜잭션의 양상이 다릅니다. 스프링은 개발자가 트랜잭션에 대한 구현 세부 사항을 신경 쓰지 않도록 트랜잭션 추상화인 `PlatformTransactionManager`를 제공합니다. 개발자는 상황에 맞게 `DataSourceTransactionManager`, `JpaTransactionManager`를 사용할 수 있으며, 이를 `트랜잭션 매니저(Transaction Manager)`라고 부릅니다.

## ✔️ 트랜잭션 동기화 매니저 (Transaction Syncronization Manager)
서비스 로직에서 여러 서비스 로직을 호출할 수 있고, 데이터 접근 로직을 호출할 수도 있습니다. 이때, <mark>**트랜잭션을 유지하기 위해서는 해당 트랜잭션을 시작한 커넥션이 여러 코드에 걸쳐 필요**</mark>하게 됩니다. `트랜잭션 동기화 매니저(Transaction Syncronization Manager)`는 이를 도와줍니다. 만약, `트랜잭션 동기화 매니저`가 없다면, 다른 코드의 메서드를 호출할 때마다 커넥션을 인자로 넘겨줘야 하는 문제가 발생합니다.