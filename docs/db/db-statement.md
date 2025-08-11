---
slug: db-statement
title: Statement와 PreparedStatement의 차이점
tags: [ db ]
---

`JDBC`에서 `Statement`와 `PreparedStatement`는 모두 `SQL` 실행을 담당하지만, 사용 방식과 성능, 보안 측면에서 차이가 존재합니다.

## ✔️ `Statement` 클래스
문자열 연결을 이용해 `SQL`을 동적으로 구성해야 합니다. 이러한 특성으로 인해 `SQL` 인젝션 공격에 취약하다는 단점이 있습니다.
```sql
Statement stmt = conn.createStatement();
ResultSet rs =  30")" >stmt.executeQuery("select * from users where age > 30");
```

## ✔️ `PreparedStatement` 클래스
동적으로 파라미터를 바인딩할 수 있는 기능을 제공합니다. 값을 바인딩하면 내부적으로 이스케이프 처리하기 때문에 SQL 인젝션 공격을 방지할 수 있습니다.
```sql
String sql = "select * from users where age > ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setInt(1, 30);
ResultSet rs = pstmt.executeQuery();
```

또한, 쿼리 구조를 미리 확정하고 플레이스 홀더를 활용하여 값을 바인딩하는 `PreparedStatement`를 사용하면 `SQL` <mark>**구문 분석 결과를 캐싱**</mark>할 수 있어 반복 실행 시 `Statement`보다 성능이 높은 것으로 알려져 있습니다.