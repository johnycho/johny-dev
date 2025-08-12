---
slug: spring-value-annotation
title: '@Value 어노테이션'
tags: [ spring ]
---

`@Value`은 설정 파일에 설정한 값을 주입할 수 있는 어노테이션입니다.

## ✔️ @Value 어노테이션 주의점
### 주입 시점
`@Value` 어노테이션은 <mark>**대상 컴포넌트가 스프링 빈으로 등록되고 의존 관계를 주입할 때 동작**</mark>합니다. 따라서 환경 변수를 주입받는 대상 클래스에 `@Component` 어노테이션을 붙여주지 않는다면 해당 클래스는 컴포넌트 스캔이 대상이 되지 않아 스프링 빈으로 등록되지 않고, `@Value` 어노테이션 또한 동작하지 않습니다.

### 주입 방식
빈을 주입받을 때와 마찬가지로 `@Value` 어노테이션을 사용할 때도 **필드 주입**, **생성자 주입**, **setter 주입** 등의 방식을 사용할 수 있습니다. 따라서 이들의 장단점을 비교하고, 상황에 따라 적절한 주입 방식을 선택해야 합니다.

### 프로퍼티 파일
프로퍼티 파일의 경로와 스코프를 확인해야 합니다. `application.properties`가 클래스 패스에 존재해야 하고, 프로퍼티 파일이 여러 개일 경우 우선 순위를 고려해야 합니다.

## ✔️ `@ConfigurationProperties` 어노테이션과의 차이점
스프링의 프로퍼티 파일의 값은 `Environment`에 등록되는데요. 두 어노테이션 모두 이 값을 불러올 수 있다는 공통점이 있습니다. 단, `@Value` 어노테이션은 <mark>**단일 값을 주입받기 위해서 사용되며, `RelaxedBinding`이 적용되지 않습니다.**</mark> `RelaxedBingding`이란 프로퍼티 이름이 조금 달라도 유연하게 바인딩을 시켜주는 규칙을 의미합니다.

반면, `@ConfigurationProperties` 어노테이션은 <mark>**프로퍼티에 있는 값을 클래스로 바인딩하기 위해 사용**</mark>됩니다. 그리고, <mark>**한 번에 여러 값을 바인딩 받을 수 있으며 `RelaxedBinding`을 적용**</mark>합니다.

## ✔️ `RelaxedBinding` (완화된 바인딩) 이란?
`application.properties`나 `application.yml`에 정의한 프로퍼티 이름과, `@ConfigurationProperties`에 선언한 필드 이름이 정확히 일치하지 않아도 매핑되도록 허용하는 기능입니다.  
즉, 언더스코어, 대시(-), 카멜케이스 차이 같은 걸 알아서 맞춰줍니다.

### `@ConfigurationProperties` 클래스
```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.config")
public class AppConfigProperties {

    private String serverName;
    private int maxConnection;

    public String getServerName() {
        return serverName;
    }
    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public int getMaxConnection() {
        return maxConnection;
    }
    public void setMaxConnection(int maxConnection) {
        this.maxConnection = maxConnection;
    }
}
```

### 프로퍼티 파일
```yaml
app:
  config:
    server-name: MyServer     # kebab-case
    max_connection: 100       # snake_case
```
또는
```yaml
app:
  config:
    serverName: MyServer      # camelCase
    maxConnection: 100
```
또는
```properties
app.config.server-name=MyServer
app.config.max_connection=100
```