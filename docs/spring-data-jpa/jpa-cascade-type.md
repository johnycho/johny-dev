---
slug: jpa-cascade-type
title: CascadeType 종류
tags: [ spring, jpa ]
---

## `CascadeType` 이란?

`CascadeType`은 **부모 엔티티에 수행한 영속성 작업을 연관된 자식 엔티티에도 전파할지**를 결정하는 옵션입니다.

> 즉, 부모를 저장·수정·삭제할 때  
> 자식에게도 같은 작업을 자동으로 적용할 것인지를 의미합니다.

---

## `CascadeType` 종류 한눈에 보기

```java
public enum CascadeType {
    ALL,
    PERSIST,
    MERGE,
    REMOVE,
    REFRESH,
    DETACH
}
```

---

## `CascadeType.PERSIST`

### 의미
**부모 저장 → 자식도 함께 저장**

```java
@OneToOne(cascade = CascadeType.PERSIST)
```

- `entityManager.persist(parent)` 호출 시
- 연관된 자식 엔티티도 자동으로 `persist`

### 사용 시점
- 생성 시 부모와 자식이 항상 함께 생성되는 관계
- 자식이 부모 없이는 의미 없는 경우

### 주의사항
- 이미 DB에 존재하는 자식을 `persist`하려 하면 예외 발생 가능

---

## `CascadeType.MERGE`

### 의미
**부모 병합 → 자식도 함께 병합**

```java
@OneToOne(cascade = CascadeType.MERGE)
```

- `entityManager.merge(parent)` 호출 시
- 자식 엔티티의 변경 사항도 함께 반영

### 사용 시점
- Detached Entity를 다시 영속화할 때
- DTO → Entity 변환 후 `merge` 패턴

---

## `CascadeType.REMOVE`

### 의미
**부모 삭제 → 자식도 함께 삭제**

```java
@OneToOne(cascade = CascadeType.REMOVE)
```

- `entityManager.remove(parent)` 호출 시
- 연관된 자식 엔티티도 삭제

### 사용 시점
- 자식의 생명주기가 부모에 완전히 종속된 관계
  - User → UserProfile
  - Order → OrderDetail

### 주의사항
- 다대일 / 다대다 관계에 사용 시 연쇄 삭제 위험
- 실무에서는 매우 신중하게 사용

---

## `CascadeType.REFRESH`

### 의미
**부모 새로고침 → 자식도 DB 상태로 되돌림**

```java
@OneToOne(cascade = CascadeType.REFRESH)
```

- `entityManager.refresh(parent)` 호출 시
- 자식 엔티티도 DB 기준으로 초기화

### 사용 빈도
- 매우 낮음 (실무에서 거의 사용하지 않음)

---

## `CascadeType.DETACH`

### 의미
**부모 영속성 컨텍스트 분리 → 자식도 분리**

```java
@OneToOne(cascade = CascadeType.DETACH)
```

- `entityManager.detach(parent)` 호출 시
- 자식도 영속성 컨텍스트에서 제거

### 사용 빈도
- 매우 낮음

---

## `CascadeType.ALL`

### 의미
모든 CascadeType 적용

```java
@OneToOne(cascade = CascadeType.ALL)
```

= `PERSIST` + `MERGE` + `REMOVE` + `REFRESH` + `DETACH`

### 주의사항
- `REMOVE`까지 포함되어 있음
- 무분별하게 사용 시 연쇄 삭제 사고 발생 가능

---

## 실무에서 자주 사용하는 조합

### 1:1 완전 종속 관계
```java
@OneToOne(
  cascade = CascadeType.ALL,
  orphanRemoval = true
)
```

- 생성 / 수정 / 삭제를 부모 기준으로 관리
- 강한 소유 관계 표현

---

### 저장·수정만 전파하고 싶을 때
```java
@OneToOne(
  cascade = {CascadeType.PERSIST, CascadeType.MERGE}
)
```

- 삭제는 명시적으로 처리
- 실무에서 가장 안전한 선택

---

## `CascadeType`과 `orphanRemoval` 차이

| 구분 | `CascadeType.REMOVE` | `orphanRemoval` |
|---|---|---|
| 삭제 트리거 | 부모 삭제 | 부모와의 관계 해제 |
| 예시 | `remove(parent)` | `parent.setChild(null)` |
| 용도 | 생명주기 종속 | 고아 객체 정리 |