---
slug: jpa-fetch-join-paging
title: JPA Fetch Join과 페이징을 함께 사용할 때 주의점
tags: [ spring, jpa ]
---

`~ToMany` 관계에서 `Fetch Join`과 페이징을 함께 사용하면 `OutOfMemoryError`가 발생할 수 있다는 점을 주의해야 합니다.

예를 들어, 아래와 같이 Product(1)-ProductCategory(N) 관계가 있을 때,  
`ProductJpaRepository`의 `findProductWithSlice`처럼 `Fetch Join`과 페이징을 함께 사용하는 경우에 `OOM`이 발생할 수 있습니다.

```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    private List categories = new ArrayList();

    // ... 중략
}

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;
}

interface ProductJpaRepository extends JpaRepository {


    @Query("""
                 select p
                 from Product p
                 join fetch p.categories pc
                 join fetch pc.category c
                 order by p.id desc
            """)
    Slice findProductWithSlice(Pageable pageable);
}
```

## ✔️ 왜 `OOM`이 발생할 수 있나?
실제로 `findProductWithSlice`를 호출하면 서버에서 다음과 같은 경고 메시지를 보여주는데요.
> firstResult/maxResults specified with collection fetch; applying in memory

실행되는 쿼리를 확인해도 페이징 쿼리가 발생하지 않습니다.
```sql
    SELECT
        p.id,
        pc.product_id,
        pc.id,
        c.id,
        c.name 
    FROM
       product p 
    JOIN
       product_category pc 
       on p.id = pc.product_id 
    JOIN
       category c 
       on c.id = pc.category_id 
    ORDER BY p.id DESC
```
`ProductCategory`를 조인하면 `Product`의 결과도 함께 증가합니다. (<mark>**카티션 프로덕트**</mark>) 따라서, 페이징을 위해 설정한 값이 의도한 대로 동작하기 어려워 <mark>**JPA는 전체 결과를 메모리에 적재한 다음에 가공하여 페이징을 수행**</mark>합니다. 이때, 수많은 데이터가 메모리에 적재된다면 `OOM`이 발생할 가능성이 있습니다.

## ✔️ 이 문제는 어떻게 해결해 볼 수 있을까?
단순히 `Fetch Join`을 사용하지 않으면 됩니다. 하지만, `Fetch Join`을 사용하지 않으면 `ProductCategory` 리스트를 조회하기 위해서 `N + 1` 쿼리가 발생할 수 있습니다.
```java
Slice result = productJpaRepository.findProductWithSlice(pageRequest);
result.forEach(product -> System.out.println(product.getCategories())); // N + 1
```

이를 해결하기 위해서는 `@BatchSize`와 `default_batch_fetch_size` 옵션을 사용할 수 있는데요. 이 기능은 Parent 엔티티(`Product`)의 Child 엔티티 컬렉션(`ProductCategory`)을 조회할 때, 영속성 컨텍스트에서 관리하는 <mark>**Parent 엔티티의 식별자를 IN 절에 추가하여 Child 엔티티를 조회하는 기능**</mark>입니다.
```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @BatchSize(size = 10)
    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    private List categories = new ArrayList();

    // ... 중략
}
```
예를 들어, 위와 같이 categories 위에 `@BatchSize`를 추가하면 다음과 같은 쿼리가 발생합니다.
```sql
    select
        pc.product_id,
        pc.id,
        pc.category_id 
    from
        product_category pc 
    where
        pc.product_id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

## ✔️ `Slice<T>` 객체
`Slice`는 `Spring Data JPA`에서 페이징 처리를 도와주는 객체 중 하나로, `Page`와 비슷하지만 총 페이지 수나 전체 개수(count) 정보는 포함하지 않습니다. 대신 다음 페이지가 있는지만 알려줍니다.
`Page<T>`와 달리 count 쿼리를 수행하지 않기 때문에, 데이터가 많을수록 성능에 이점이 있습니다.

`Slice`는 다음 페이지가 있는지만 확인하면서 데이터를 페이지 단위로 가져올 수 있게 해주는 경량 페이징 도구입니다.
`Page`보다 성능이 좋지만, 전체 개수 정보가 필요하면 `Page`를 써야 합니다.

```java
Slice<Product> result = productRepository.findProductWithSlice(PageRequest.of(0, 10));
```
반환된 `Slice<Product>`는 다음과 같은 정보 포함:
* `result.getContent()` → 현재 페이지의 Product 리스트
* `result.hasNext()` → 다음 페이지 존재 여부