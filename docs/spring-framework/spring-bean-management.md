---
slug: spring-bean-management
title: Spring에서 객체를 Bean으로 관리하는 이유
tags: [ spring ]
---

Spring에서 `Bean`으로 객체를 관리하는 이유는 애플리케이션의 설계, 확장성, 유지보수 측면에서 많은 이점을 제공하기 때문입니다.

## ✔️ 의존성 관리 자동화
빈으로 등록된 객체들은 `Spring` 컨테이너(`BeanFactory`, `ApplicationContext`)가 자동으로 의존성을 주입해줍니다. 개발자가 직접 객체를 생성하고 의존성을 연결할 필요가 없어집니다. 또 <mark>**컨테이너가 빌드 시점에 순환 의존성을 감지하여 설계 오류를 조기에 발견**</mark>할 수 있습니다.
```java
@Service
class OrderService(
    private val productRepository: ProductRepository,  // 자동 주입
    private val paymentGateway: PaymentGateway        // 자동 주입
)
```

## ✔️ 싱글톤 패턴 구현
기본적으로 `Spring`은 <mark>**빈을 싱글톤으로 관리하여 메모리 사용을 최적화**</mark>하고, 불필요한 객체 생성을 방지합니다.
```java
// 아래 두 userRepository는 동일한 인스턴스
@Service
class UserService(private val userRepository: UserRepository)

@Service
class AuthService(private val userRepository: UserRepository)
```

## ✔️ 생명주기 관리
`Spring`은 <mark>**빈의 초기화와 소멸 과정을 자동으로 관리**</mark>합니다. 이를 통해 리소스 할당 및 해제를 체계적으로 처리할 수 있습니다.
```java
@Component
class DatabaseConnection {
    @PostConstruct
    fun initialize() {
        // 초기화 로직
    }
    
    @PreDestroy
    fun cleanup() {
        // 리소스 정리 로직
    }
}
```

## ✔️ AOP(관점 지향 프로그래밍) 지원
빈으로 관리되는 객체들은 트랜잭션 관리, 로깅, 보안 등의 <mark>**공통 관심사를 쉽게 적용**</mark>할 수 있습니다.
```java
@Service
class TransferService(private val accountRepository: AccountRepository) {
    @Transactional  // AOP를 통한 트랜잭션 관리
    fun transferMoney(from: String, to: String, amount: BigDecimal) {
        // 송금 로직
    }
}
```

## ✔️ 테스트 용이성
빈으로 관리되는 컴포넌트는 모킹(mocking)이나 <mark>**테스트용 구현체로 쉽게 대체**</mark>할 수 있어 단위 테스트와 통합 테스트가 용이합니다.
```java
@SpringBootTest
class UserServiceTest {
    @MockBean
    lateinit var userRepository: UserRepository
    
    @Autowired
    lateinit var userService: UserService
    
    @Test
    fun testGetUser() {
        // given
        val userId = 1L
        whenever(userRepository.findById(userId)).thenReturn(User(userId, "Test User"))
        
        // when
        val result = userService.getUser(userId)
        
        // then
        assertEquals("Test User", result.name)
    }
}
```

## ✔️ 설정의 중앙화
애플리케이션의 구성 요소들을 빈으로 관리함으로써 <mark>**설정을 중앙화하고 일관된 방식으로 관리**</mark>할 수 있습니다.
```java
@Configuration
class AppConfig {
    @Bean
    fun dataSource(): DataSource {
        return HikariDataSource().apply {
            jdbcUrl = "jdbc:postgresql://localhost:5432/mydb"
            username = "user"
            password = "password"
            maximumPoolSize = 10
        }
    }
}
```