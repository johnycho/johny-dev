---
slug: jpa-id-generation-strategy
title: ID 생성 전략
tags: [ spring, jpa ]
---

# JPA의 ID 생성 전략

JPA에서 ID를 생성하기 위해서는 직접 할당과 자동 할당을 사용할 수 있습니다. 직접 할당은 `@Id`어노테이션만을 사용하여 Id값을 직접 할당하는 방식입니다. 반면, 자동
할당은 `@Id`와 `@GeneratedValue`를 함께 사용해서 원하는 키 생성 전략을 선택하는 방식입니다. `@GeneratedValue`의 stretagy 옵션을 통해 생성
전략을 설정할 수 있는데, 여기에 올 수 있는 값인 GenerationType는 다음과 같습니다.

```java
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface GeneratedValue {

  GenerationType strategy() default GenerationType.AUTO;

  String generator() default "";
}

public enum GenerationType {
  AUTO,
  IDENTITY,
  SEQUENCE,
  TABLE
}
```

## ✔️ 자동 생성 방식을 사용할 때 각 전략은 뭐가 다른거야? 🤔

### IDENTITY
기본 키 생성을 DB에 위임하는 전략입니다. 주로 MySQL, PostgreSQL, SQL Server, DB2에서 사용됩니다. 해당 전략을 사용하면 엔티티를 생성할 때 쓰기
지연이 적용되지 않습니다. 왜냐하면 JPA에서 엔티티를 영속하기 위해선 식별자가 필요한데, IDENTITY 전략에서는 이 식별자가 DB에 저장되어야 할당되기 때문입니다. 따라서
엔티티를 생성할 때 즉시 INSERT 쿼리가 실행되어야 합니다. 이때 하이버네이트를 사용하는 경우에는 INSERT 쿼리의 결과를 다시 조회하지 않기 위해서 내부적으로
`Statement.getGeneratedKeys`를 사용합니다. 추가로 IDENTITY 전략을 사용하면 배치 인서트가 불가하다는 점을 주의해야합니다.

### SEQUENCE
시퀀스 키 생성 전략을 지원하는 DB에서 사용할 수 있습니다. 데이터베이스 시퀀스란, 유일한 값을 자동으로 생성하게 하는 객체입니다. `auto_increment`와 달리 초기
값과 한번에 증가할 크기를 설정할 수 있습니다. 해당 시퀀스를 키 생성 전략으로 갖는 DB에 대해 SEQUENCE 전략을 사용할 수 있습니다. 어떤 시퀀스를 사용할 것인지를
`@SequenceGenerator` 로 설정할 수 있습니다. SEQUENCE 전략은 `em.persist()`를 호출하는 경우 먼저 데이터베이스 시퀀스를 이용하여 식별자를
조회합니다. 이후 조회한 식별자를 엔티티에 할당한 후에 엔티티를 영속성 컨텍스트에 저장합니다. 트랜잭션을 커밋하여 플러시가 일어나면 엔티티를 저장한다는 점에서 IDENTITY
전략과 차이가 있습니다.

### TABLE
키 생성 전용 테이블을 만들어 시퀀스를 흉내내는 전략입니다. 어떤 테이블을 사용할 것인지를 `@TableGenerator`로 설정할 수 있습니다. TABLE 전략은 값을 조회하면서
SELECT 쿼리를 사용하며 증가를 위해 UPDATE 쿼리를 사용합니다. SEQUENCE 전략보다 DB와 한번 더 통신한다는 점에서 성능이 안좋다는 단점이 있지만, 모든 DB에
적용할 수 있다는 장점이 있습니다.

### AUTO
데이터베이스 방언에 따라서 IDENTITY, SEQUENCE, TABLE 중 하나를 자동으로 선택합니다. 데이터베이스를 변경해도 코드를 수정할 필요가 없다는 장점이 있습니다.