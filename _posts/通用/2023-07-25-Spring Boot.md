---
title: "Spring Boot"
date: 2023-07-25 16:37
categories: [通用]
tags: ["技术整理", "spring"]
---

Owner: Olimi
tags: 技术整理
date: 2023年7月25日 16:37
status: Published
summary: 这篇文章介绍了Spring和Spring Boot的基本概念和区别，以及Servlet和Reactive的不同请求处理方式。还介绍了Spring Boot的自动配置和常用的property，以及使用OAuth2库对资源服务器jwt的支持。最后，提供了一些关于maven的小问题汇总。
type: Post

# Spring

Spring guide: [Spring | Guides](https://spring.io/guides)

- 快速入门：[Spring | Quickstart --- 春天 |快速入门](https://spring.io/quickstart)
- spring-boot: [Getting Started | Building an Application with Spring Boot --- 入门 |使用 Spring 引导构建应用程序](https://spring.io/guides/gs/spring-boot/)

JAVA Guide: [Spring常见面试题总结 | JavaGuide(Java面试 + 学习指南)](https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html)

## 基本概念

- spring和spring boot的详细介绍。
    
    Spring是一个开源的Java框架，提供了一系列的组件和技术，用于构建企业级Java应用程序。Spring框架主要由核心容器(Core Container)，数据访问集成(Data Access/Integration)，Web应用(Web)和AOP(Aspect Oriented Programming)等模块组成，可以使Java开发更加简洁、高效、灵活。Spring的目标是促进开发高质量的Java应用程序，同时提倡良好的编码和设计实践。
    
    Spring Boot是Spring框架的一个子项目，旨在提供一种快速、轻量级、简单易用的方式来构建基于Spring的应用程序。Spring Boot通过自动配置、预定义依赖、无需XML配置等特性，让开发者更加专注于业务逻辑，而不必花太多精力配置环境和编写样板代码。Spring Boot还提供了嵌入式Web服务器、Actuator监控支持等特性，让开发者能够更快地开启应用程序的开发、测试和部署流程。
    
    Spring Boot有以下主要特点：
    
    1. 快速启动和开发。Spring Boot提供了嵌入式的Web服务器和预定义依赖，可以轻松创建和启动Spring应用程序。
    2. 自动配置。Spring Boot自动为常用的第三方库、框架等配置Beans，简化了应用程序的配置和启动
    3. 简单易用。Spring Boot的设计遵循"约定优于配置"的原则，提供了简洁的API和注解，让应用程序可以更快地编写和维护。
    4. 微服务支持。Spring Boot的设计非常适合微服务架构，提供了对多种云平台的支持和集成。
    
    综上所述，Spring和Spring Boot都是为了更好地实现Java应用程序开发而存在的，各自有不同的特点和优势，适合于不同的开发场景和需求。
    
- 关于spring里 servlet and reactive
    
    > 在Spring中，Servlet是使用传统的基于线程的模型处理请求和响应的一种方式，而Reactive是使用基于事件的异步模型处理请求和响应的一种方式。
    > 
    > 
    > Servlet处理方式：
    > 
    > 1. 传统的Servlet容器中使用线程池来为每个请求创建一个单独的线程处理。
    > 2. 处理过程中使用阻塞操作读取请求和写出响应。
    > 3. 当线程被分配时，它一直保持活动状态，直到响应发送回客户端为止。
    > 4. 这导致并发请求量受限于可用的CPU和内存资源。
    > 
    > Reactive处理方式：
    > 
    > 1. Reactive模型中，每个请求都在单个线程中进行处理。
    > 2. 当请求进入应用程序时，它被分配给可用线程池中的某个线程。
    > 3. 该线程会处理请求和响应，并在发出任何阻塞操作之前立即返回。
    > 4. 应用程序使用回调或RxJava等响应式编程库来处理响应。
    > 5. 这种处理方式非常适合高并发环境，可以轻松地支持数千个并发连接。
    > 
    > 总之，Servlet和Reactive是两种不同的请求处理方式，在不同的场景下有不同的用途和优缺点。 Servlet适合处理单个请求，处理简单且短暂的任务，而Reactive适合处理大量的并发请求，能够更高效地利用系统资源，提高系统性能和吞吐量。
    > 

## SpringBoot

记得使用SringBoot各种starter.

常用的property: [常见的 Application Properties (springdoc.cn)](https://springdoc.cn/spring-boot/application-properties.html#appendix.application-properties.security)

## Spring Security

[获取 Spring Security :: Spring Security Reference (springdoc.cn)](https://springdoc.cn/spring-security/getting-spring-security.html)

注意在文档其他地方的使用特定的API前，必须注意上述文章最开始获取Spring Security。通过SpringBoot获取即添加：

```jsx
<dependencies>
	<!-- ... 其他依赖元素 ... -->
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-security</artifactId>
	</dependency>
</dependencies>
```

这里主要使用OAuth2库，对资源服务器jwt的支持。

[OAuth 2.0 资源服务器 JWT :: Spring Security Reference (springdoc.cn)](https://springdoc.cn/spring-security/servlet/oauth2/resource-server/jwt.html)

所以引入依赖时：

```jsx
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

或者：

```jsx
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

**重点：使用Spirng依赖时，记得SpringBoot启用自动化配置，即使用依赖相应的starter，格式为：Spring-boot-starter-xxx.**

工作原理：

![img](/assets/img/posts/Spring Boot/Spring Boot-1.png)

![img](/assets/img/posts/Spring Boot/Spring Boot-2.png)

扩展：

使用Spring搭建授权服务器：[入门 (springdoc.cn)](https://springdoc.cn/spring-authorization-server/getting-started.html)

# Mybatis

[Mybatis使用](Spring%20Boot/Mybatis%E4%BD%BF%E7%94%A8%206688631ccff84b7c983cc68e94145dc3.md) 

# 工程问题

## maven

spring-boot-2提示的warning

```jsx
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <!-- 解决这个问题：Provides transitive vulnerable dependency maven:org.yaml:snakeyaml:1.30 <exclusions>-->
            <exclusions>
                <exclusion>
                    <groupId>org.yaml</groupId>
                    <artifactId>snakeyaml</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
<dependency>
            <groupId>org.yaml</groupId>
            <artifactId>snakeyaml</artifactId>
            <version>2.0</version>
        </dependency>
```