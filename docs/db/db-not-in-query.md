---
slug: db-not-in-query
title: NOT IN 쿼리 문제와 최적화 방법
tags: [ db ]
---

아래와 같이 `NOT IN`을 사용한 쿼리는 직관적이고 사용하기 쉽지만, 대규모 데이터셋에서 심각한 성능 저하를 일으킬 수 있습니다.
```sql
SELECT p
FROM Post p
WHERE p.id NOT IN :postIds
```
### 문제점
* `NOT IN`은 부정 조건으로, 대부분의 `DBMS`에서 <mark>**전체 테이블 스캔이나 인덱스 풀 스캔을 유발**</mark>합니다. 전체 데이터나 테이블을 스캔한 후 조건에 맞지 않는 레코드를 필터링 해야하기 때문에 데이터베이스 옵티마이저가 효율적인 실행 계획을 세우기 어렵습니다.
* 인덱스를 효과적으로 활용하지 못합니다. `IN` 절은 인덱스 `Range Scan`을 통해 빠르게 처리할 수 있지만, `NOT IN`은 <mark>**인덱스 활용도가 현저히 떨어집니다.**</mark>
* 대량의 값을 `IN` 절에 넣으면 <mark>**실행 계획 생성이 늘어나고, 파싱 및 최적화 단계에서 추가적인 오버헤드가 발생**</mark>합니다.
* `NULL` 값 처리 로직으로 인한 예상치 못한 결과가 발생할 수 있습니다. 예를 들어, `column NOT IN (1, 2, NULL)`은 항상 빈 결과를 반환합니다.

## ✔️ 최적화 방안
### 1. NOT EXISTS 활용
`NOT EXISTS`는 <mark>**행 단위로 평가되어 매칭되는 첫 행을 찾자마자 평가를 중단**</mark>합니다. 이는 `DBMS`가 '존재하지 않음'을 확인하기 위해 특별히 최적화된 방식입니다. 대규모 데이터셋에서 가장 안정적이고 확장성 있는 성능을 제공합니다.
```sql
SELECT p FROM Post p
WHERE NOT EXISTS (
    SELECT 1 FROM Post temp
    WHERE temp.id = p.id AND temp.id IN :postIds
)
```

### 2. LEFT JOIN + IS NULL 패턴
이 방식은 서브쿼리 결과가 작을 때 특히 효율적입니다. 인덱스를 효과적으로 활용할 수 있으며, `PK` 인덱스를 사용한 `JOIN` 연산이 최적화됩니다.
```sql
SELECT p FROM Post p 
LEFT JOIN (
    SELECT temp.id FROM Post temp WHERE temp.id IN :postIds
) filtered ON p.id = filtered.id
WHERE filtered.id IS NULL
```