---
id: "sentinel"
title: "Sentinel限流方案"
slug: "sentinel"
excerpt: "Spring/SpringMVC/SpringBoot 丝滑接入Sentinel限流方案"
tags: ["tutorials"]
author:
  name: "帝八哥"
  avatar: "/images/default.webp"
publishedAt: "2020-04-25"
imageUrl: "/images/default.webp"
featured: false
---

# Sentinel限流接入
-  SpringBoot项目接入流程

-  SpringMVC项目接入流程

-  注意事项

-  并发接口测试

-  Sentinel日志说明


## SpringBoot项目接入流程

1.  Sentinel控制台

2.  Nacos配置中心

3.  SpringBoot应用

4.  测试效果

### Sentinel控制台

-   版本`1.7.2`

-   登录账号**`sentinel/sentinel`**

### Nacos配置中心

-   版本`1.2.1`

-   登录账号**`nacos/nacos`**

-   各个应用需要添加**`限流规则配置文件`**, 并遵从如下规则

    1.  data-id命名格式, **`${spring.application.name}-flow-rules`**, 其中**`${spring.application.name}`**为应用配置的项目名称, 例如: **`spring.application.name=usersystem`**

    2.  所属group统一设置为**`SENTINEL_GROUP`**

### SpringBoot应用

-   版本及依赖

-   属性文件及Configure配置

-   RestTemplate接入

-   Dubbo接入

-   Redis接入

-   MQ接入

#### 版本及依赖

**1.版本信息.**
```xml
<properties>
    <springboot.version>2.1.2.RELEASE</springboot.version>
    <!-- 接入sentinel版本 -->
    <sentinel.version>1.7.1</sentinel.version>
    <!-- sentinel-start版本 -->
    <alibaba-sentinel-starter.version>2.2.1.RELEASE</alibaba-sentinel-starter.version>
    <!-- nacos版本 -->
    <nacos-config-spring-boot.version>0.2.7</nacos-config-spring-boot.version>
</properties>
```
**2.父工程pom.xml.**
```xml
<dependencies>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        <version>${alibaba-sentinel-starter.version}</version>
        <!--排除该包, 解决RestTemplate初始化报错找不到 com.fasterxml.jackson.core.TSFBuilder 的问题-->
        <exclusions>
            <exclusion>
                <artifactId>jackson-dataformat-xml</artifactId>
                <groupId>com.fasterxml.jackson.dataformat</groupId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>com.alibaba.csp</groupId>
        <artifactId>sentinel-datasource-nacos</artifactId>
        <version>${sentinel.version}</version>
    </dependency>
</dependencies>
```
**3.WEB子模块pom.xml.**
```xml
<dependencies>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba.csp</groupId>
        <artifactId>sentinel-datasource-nacos</artifactId>
    </dependency>
</dependencies>
```

其他子模块若使用到**`@SentinelResource注解`**, 只需在pom.xml引入**`spring-cloud-starter-alibaba-sentinel`**包
```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    <version>${alibaba-sentinel-starter.version}</version>
</dependency>
```
#### 属性文件及Configure配置

**1.application.properties配置.**
```pl
# 应用名
spring.application.name=usersystem
# nacos限流规则数据源配置
spring.cloud.sentinel.datasource.ds1.nacos.data-id=${spring.application.name}-flow-rules
spring.cloud.sentinel.datasource.ds1.nacos.group-id=SENTINEL_GROUP
spring.cloud.sentinel.datasource.ds1.nacos.data-type=json
spring.cloud.sentinel.datasource.ds1.nacos.rule-type=flow
```

**2.application-dev(\[test\|pre\|prod\]).properties配置.**
```pl
    # sentinel与控制台通信端口, 根据环境修改
    spring.cloud.sentinel.transport.port=38119
    # 是否有访问量时才进行限流初始化(sentinel懒加载)
    spring.cloud.sentinel.eager=true
    # sentinel-dashboard控制台地址, 根据环境修改
    spring.cloud.sentinel.transport.dashboard=172.16.10.41:8081
    # sentinel-nacos通信配置地址, 根据环境修改
    spring.cloud.sentinel.datasource.ds1.nacos.server-addr=172.16.10.41:8848
    # sentinel-nacos配置命名空间, 根据环境修改
    spring.cloud.sentinel.datasource.ds1.nacos.namespace=dev-41-id
    # 自定义日志文件, 根据自身应用修改, 建议设为 原始应用日志目录/csp, 以用户系统为例
    spring.cloud.sentinel.log.dir=/work/www/usersystem_new.htjy.com/logs/csp
```

**3.WebConfig配置.**
```java
/**
 * WEB配置
 * 可增加拦截器、异步/跨域支持
 * <p>
 * 注意：
 * 1.@EnableWebMvc + implements WebMvcConfigurer
 * 2.extends WebMvcConfigurationSupport
 * 都会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置
 * 例如: 请求参数时间格式/响应字段为NULL剔除
 * 因此, 推荐使用 implements WebMvcConfigurer方式, 保留原有配置
 * 3.自定义消息转换器, 推荐直接使用注册Bean
 * 也可使用复写extendMessageConverters()方法,
 * 但是注意: 不要使用configureMessageConverters, 该方法要么不起作用, 要么关闭了默认配置
 *
 */
@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 拦截器逻辑, 权限等
    }
}
```
WebConfig不得**extends WebMvcConfigurationSupport**, 否则会引起默认配置失效

#### RestTemplate接入

1.  SentinelRestTemplate异常处理工具类

2.  配置RestTemplate

**示例基类响应.**
```java
@Data
public class BaijiaCloudResp<T> implements Serializable {

    private int code;
    private String msg;
    private T data;
}
```

**SentinelExceptionUtil.**

```java
/**
 * Sentinel异常统一处理工具类
 */
public class SentinelExceptionUtil {
    public static SentinelClientHttpResponse restTemplateHandleException(HttpRequest request, byte[] body, ClientHttpRequestExecution execution, BlockException ex) {
        BaijiaCloudResp resp = new BaijiaCloudResp();
        resp.setCode(-1);
        resp.setMsg("限流生效异常");
        return new SentinelClientHttpResponse(JSONUtil.toJSONStringWithDateFormat(resp));
    }

    public static SentinelClientHttpResponse restTemplateFallback(HttpRequest request, byte[] body, ClientHttpRequestExecution execution, BlockException ex) {
        BaijiaCloudResp resp = new BaijiaCloudResp();
        resp.setCode(-1);
        resp.setMsg("降级生效异常");
        return new SentinelClientHttpResponse(JSONUtil.toJSONStringWithDateFormat(resp));
    }

}
```
**RestTemplateConfig.**
```java
@Configuration
public class RestTemplateConfig {

    @Bean(name = "restTemplate")
    // 被@SentinelRestTemplate标注的restTemplate执行http请求时底层会被拦截
    // 默认情况下, 当发生限流\|降级异常时拦截器底层会返回固定字符串, 这将导致后续出现JSON解析异常
    // 所以配置SentinelExceptionUtil中的异常处理方法, 返回一个空的基类响应对象, 并用特殊的code标识
    @SentinelRestTemplate(blockHandler = "restTemplateHandleException", blockHandlerClass = SentinelExceptionUtil.class, fallback = "restTemplateFallback", fallbackClass = SentinelExceptionUtil.class)
    RestTemplate ignoreHttpsRestTemplate() {
        // 创建RestTemplate的代码
    }
}
```

### SpringBoot项目测试效果
- ![资源注解及链路入口](https://img.willclass.com/api/download/file?fileKey=c41f0795ddb65c5e6dbe25bdd938da49@40.png)

- HTTP接口server端测试

![测试流程](https://img.willclass.com/api/download/file?fileKey=7e96cc41a9084f4308f6e4b5ad77d805@40.png)

![直接限流](https://img.willclass.com/api/download/file?fileKey=042a3478c290c99bed6bf474016ba277@40.png)

![链路限流](https://img.willclass.com/api/download/file?fileKey=0c1db3f791a2708fbfb125006b5a4e6d@40.png)

![关联限流](https://img.willclass.com/api/download/file?fileKey=9fa0ed9758737b69c81702dfb45365bf@40.png)

![流控](https://img.willclass.com/api/download/file?fileKey=6942ba9886cf322ca6a8c6c6df6c72bb@40.png)


## Sentinel日志说明
- 应用启动日志, NacosDataSource规则接收日志, 参见**`sentinel-record.log`**

- 秒级监控日志**`XXX-metrics.log`**格式说明

<table style="width:100%;"><colgroup><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /><col style="width: 10%" /></colgroup><tbody><tr class="odd"><td><p>时间戳</p></td><td><p>格式化时间</p></td><td><p>资源全称</p></td><td><p>到来的QPS</p></td><td><p>已被拦截的QPS</p></td><td><p>成功通过的QPS</p></td><td><p>有异常的QPS</p></td><td><p>平均响应时长RT(ms)</p></td><td><p>OccupiedPassQps:0</p></td><td><p>concurrency:0</p></td></tr><tr class="even"><td><p>1588063361000</p></td><td><p>2020-04-28 16:42:41</p></td><td><p>/ruok</p></td><td><p>2</p></td><td><p>192</p></td><td><p>2</p></td><td><p>0</p></td><td><p>20</p></td><td><p>0</p></td><td><p>0</p></td></tr></tbody></table>

- 限流\|降级请求拦截日志**`sentinel-block.log`**格式说明

<table style="width:100%;"><colgroup><col style="width: 14%" /><col style="width: 14%" /><col style="width: 14%" /><col style="width: 14%" /><col style="width: 14%" /><col style="width: 14%" /><col style="width: 14%" /></colgroup><tbody><tr class="odd"><td><p>时间戳</p></td><td><p>当前发生的第几个资源</p></td><td><p>资源名</p></td><td><p>异常名</p></td><td><p>针对调用应用来源</p></td><td><p>被拦截资源的调用者(可以为空)</p></td><td><p>被拦截数量</p></td></tr><tr class="even"><td><p>2020-04-28 16:42:42</p></td><td><p>1</p></td><td><p>/ruok</p></td><td><p>FlowException</p></td><td><p>default</p></td><td><p>(可以为空)</p></td><td><p>17</p></td></tr></tbody></table>

**辅助检查链路接口.**
```plaintext
    http://IP:通信端口(${spring.cloud.sentinel.transport.port})/tree\?type\=root
    http://IP:通信端口(${spring.cloud.sentinel.transport.port})/origin\?id\=资源名称(/ruok)
```

- [求🌟🌟](https://github.com/caofanCPU), 分享不易, 请老铁给我的github主页的6个项目点赞, 谢谢!