+++
title = "架构演进之路：从单体、集群到分布式"
description = "图解架构演进：微服务拆分、注册发现、网关路由、熔断降级与分布式事务"
date = 2026-01-06
updated = 2026-01-06
template = "post.html"
insert_anchor_links = "right"

[taxonomies]
tags = ["distributed systems", "microservices", "Spring Cloud", "ai note", "架构演进"]

[extra]
toc = true
math = false
copy = true
comment = false
mermaid = true
+++

## 引言：故事的起点

想象我们开了一家小超市。起初，店里只有一个老板（服务器），收银、理货、打扫全包了。随着生意越来越好，一个老板忙不过来了，我们面临架构升级的选择。

在软件架构中，这对应着三个阶段：**单体**、**集群**、**分布式**。

{% mermaid() %}
flowchart TB
    %% 强制垂直布局
    Monolith ~~~ Cluster ~~~ Distributed

    subgraph Monolith [1. 单体 Monolith]
        direction TB
        Boss1[全能老板]
        Job1[收银+理货+保洁]
        Boss1 --- Job1
        desc1[一个人干所有事]:::note
    end

    subgraph Cluster [2. 集群 Cluster]
        direction TB
        subgraph NodeA [节点 A]
            Boss2[老板 分身]
        end
        subgraph NodeB [节点 B]
            Boss3[老板 分身]
        end
        desc2[多个人干一样的事]:::note
    end

    subgraph Distributed [3. 分布式 Distributed]
        direction TB
        subgraph ServiceA [收银服务]
            Worker1[收银专家]
        end
        subgraph ServiceB [理货服务]
            Worker2[理货专家]
        end
        desc3[多个人干不同的事]:::note
    end

    classDef note fill:#f9f,stroke:#333,stroke-width:0px,color:black;
{% end %}

## 一、 单体架构的烦恼 (Monolithic)

以前，我们将商城的“商品、订单、支付、用户”所有功能都写在一个项目里（比如一个巨大的 `.jar` 或 `.war` 包）。

{% mermaid() %}
flowchart TB
    subgraph App [Monolith Application]
        P[Product]
        O[Order]
        Pay[Payment]
        User[User]
    end
    
    DB[(Huge Database)]
    
    App --> DB
{% end %}

*   **牵一发而动全身**：改一行商品模块的代码，整个商城都要重新编译、打包、部署。
*   **数据库瓶颈**：几百万条订单、商品数据都挤在一个数据库里，表关联复杂（JOIN），高并发时数据库连接池瞬间被占满。
*   **技术栈受限**：全组人都得用同一种语言，很难引入新技术。

为了解决这些问题，我们决定把这个庞然大物**拆开**。

## 二、 进阶：微服务与数据的拆分

我们按**业务边界**，把大商城拆成了一个个独立的小应用。每个应用可以独立部署、独立扩展。

### 2.1 连数据也要分家

光拆代码不够，数据也要分家。**微服务的金标准：数据库私有化**。
商品服务只连商品库，订单服务只连订单库。如果订单需要商品信息，不能去查商品表，而是要**调用商品服务的接口**。

{% mermaid() %}
flowchart LR
    User((用户请求)) --> OrderService[订单微服务]
    
    subgraph OrderDomain [订单域]
        OrderService --> OrderDB[(订单库)]
    end
    
    subgraph ProductDomain [商品域]
        ProductService[商品微服务] --> ProductDB[(商品库)]
    end
    
    OrderService -- RPC 调用 --> ProductService
{% end %}

### 2.2 消除单点故障：分布式中的集群

既然拆开了，每个小服务也不能只部署一份。比如“商品服务”，我们可以在三台服务器上都部署一份。
**目的**：**消除单点故障（SPOF）**。一台挂了，另外两台还能顶上，鸡蛋不放在一个篮子里。

{% mermaid() %}
flowchart LR
    Order[订单服务]
    
    subgraph ProductCluster [商品服务集群]
        P1[商品服务 A <br/> 192.168.0.1]
        P2[商品服务 B <br/> 192.168.0.2]
    end
    
    Order --> P1
    Order --> P2
{% end %}

## 三、 分布式治理：大管家与通讯录

机器多了，它们怎么配合？以前都在一台机器内存里调用，现在变成了跨网络的迷宫。

### 3.1 注册中心 (Registry)：服务的通讯录

订单服务想找商品服务，它怎么知道商品服务在哪几台机器上（IP是多少）？万一商品服务扩容了或者挂了怎么办？
这时候需要一个**注册中心**（如 Nacos）。

{% mermaid() %}
sequenceDiagram
    participant Provider as 商品服务 (Provider)
    participant Registry as 注册中心 (Nacos)
    participant Consumer as 订单服务 (Consumer)

    Note over Provider, Registry: 1. 上线注册
    Provider->>Registry: 注册: 我是商品服务, IP: 192.168.0.1
    
    Note over Consumer, Registry: 2. 服务发现
    Consumer->>Registry: 查询: 商品服务在哪里?
    Registry-->>Consumer: 返回列表: [192.168.0.1, 192.168.0.2]
    
    Note over Provider, Registry: 3. 心跳保活
    loop 每隔几秒
        Provider->>Registry: 心跳: 我还活着
    end
    
    Note over Consumer, Provider: 4. 负载均衡调用
    Consumer->>Provider: 发起 RPC 调用
{% end %}

1.  **服务注册**：商品服务启动时，告诉注册中心“我是商品，我在 192.168.0.1”。
2.  **服务发现**：订单服务从注册中心拉取“商品服务”的所有地址列表，并缓存在本地。
3.  **心跳保活**：商品服务每隔几秒发个心跳，告诉注册中心“我还活着”。

### 3.2 负载均衡 (Load Balance)：谁来干活？

订单服务手里握着一堆商品服务的地址，该选谁？
这就是**负载均衡**（如 Ribbon/LoadBalancer）。

*   **轮询 (Round Robin)**：1 -> 2 -> 3 -> 1...
*   **随机 (Random)**：随便抓一个。
*   **权重 (Weighted)**：性能好的机器多干点。

### 3.3 配置中心 (Config)：云端统一管理

几十个微服务，几百个配置文件。改个超时时间，难道要一个个登录服务器去改文件重启？
**配置中心**允许我们在云端修改配置，然后**主动推送**给所有微服务，实现**热更新**。

{% mermaid() %}
flowchart LR
    Ops[运维人员] -- 修改配置 --> Config[Nacos 配置中心]
    Config -- 推送变更 (Push) --> S1[微服务实例 A]
    Config -- 推送变更 (Push) --> S2[微服务实例 B]
    
    style S1 stroke-dasharray: 5 5
    style S2 stroke-dasharray: 5 5
{% end %}

## 四、 流量入口：网关 (Gateway)

用户不管是买东西还是看直播，只认一个域名（比如 `jd.com`）。后台几千个微服务 IP 变来变去，不能暴露给用户。
我们需要一个**网关**来充当“前台接待”。

{% mermaid() %}
flowchart TB
    User[User / Client] --> Gateway[API 网关 <br/> Spring Cloud Gateway]
    
    subgraph GatewayFunc [网关职能]
        direction TB
        Auth[1. 统一鉴权]
        Route[2. 路由转发]
        Limit[3. 限流保护]
    end
    
    Gateway --- GatewayFunc
    
    Gateway -- /order/** --> Order[订单服务]
    Gateway -- /product/** --> Product[商品服务]
{% end %}

## 五、 稳定性：熔断与雪崩效应

分布式系统最怕**级联故障**。
假设：用户 -> 订单 -> 支付。
如果“支付”服务卡死了（处理一个请求要10秒），“订单”服务的线程就会卡在等待支付响应上。几百万个请求涌进来，订单服务的线程池瞬间耗尽，导致订单服务也挂了。
这就是**雪崩效应（Avalanche Effect）**。

### 5.1 熔断机制 (Circuit Breaker)

我们需要给系统装个保险丝（如 Sentinel）。

{% mermaid() %}
stateDiagram-v2
    [*] --> Closed: 初始状态
    
    Closed --> Open: 错误率/响应时间超标
    note right of Closed
        正常调用
        熔断器关闭
    end note
    
    Open --> HalfOpen: 冷却时间结束 (Sleep Window)
    note right of Open
        熔断器打开
        拒绝所有请求 (Fail Fast)
    end note
    
    HalfOpen --> Closed: 探测请求成功
    HalfOpen --> Open: 探测请求失败
    note right of HalfOpen
        半开状态
        放行少量请求测试
    end note
{% end %}

*   **Closed**：正常状态，大家随便调。
*   **Open**：支付服务挂了，保险丝跳闸。订单服务再调支付，直接**快速失败**（返回“系统繁忙”），不需等待，保护自己。
*   **Half-Open**：过一会，试探性放一个请求过去，如果成功了，就恢复闭合；失败了继续断开。

## 六、 终极难题：分布式事务

以前在一个数据库里，扣钱和加积分要么都成，要么都败（ACID 事务）。
现在，钱在“支付库”，积分在“用户库”。
如果钱扣了，网络一抖，积分没加成，数据就不一致了。

这就涉及到**分布式事务**（如 Seata）。我们需要一个“大管家”来协调全局。

{% mermaid() %}
sequenceDiagram
    participant TC as Seata TC (协调者)
    participant RM1 as 支付服务 (RM)
    participant RM2 as 用户服务 (RM)
    
    Note over RM1, RM2: Phase 1: 准备阶段
    RM1->>TC: 执行扣款，不提交
    RM2->>TC: 执行加分，不提交
    
    Note over TC: 决议阶段
    
    alt 所有本地事务成功
        TC->>RM1: Phase 2: 全局提交 (Commit)
        TC->>RM2: Phase 2: 全局提交 (Commit)
    else 任意一个失败
        TC->>RM1: Phase 2: 全局回滚 (Rollback)
        TC->>RM2: Phase 2: 全局回滚 (Rollback)
    end
{% end %}

*   **两阶段提交 (2PC)**：
    1.  **准备阶段**：大家都执行本地事务，但不提交，告诉大管家“我好了”。
    2.  **提交阶段**：大管家看大家都好了，一声令下“全体提交！”；只要有一个没好，一声令下“全体回滚！”

## 七、 技术落地：Spring Cloud Alibaba 全家桶

理论很丰满，落地看组件。

| 架构层级 | 核心痛点 | 解决方案 (组件) | 作用一句话 |
| :--- | :--- | :--- | :--- |
| **基础层** | 服务如何构建？ | **Spring Boot** | 约定大于配置，快速开发 |
| **治理层** | 服务在哪？配置咋管？ | **Nacos** | 注册中心 + 配置中心 |
| **网关层** | 统一入口怎么做？ | **Gateway** | 路由、鉴权、限流 |
| **调用层** | 怎么优雅调接口？ | **OpenFeign** | 像调本地方法一样调远程 |
| **保护层** | 怎么防雪崩？ | **Sentinel** | 熔断降级、流量控制 |
| **数据层** | 跨库事务咋办？ | **Seata** | 一站式分布式事务解决方案 |

**总结**：
分布式架构不是为了炫技，而是为了解决**高并发、高可用、高扩展**的实际问题。它把单体这个“巨石”敲碎，变成了无数精巧的积木，通过网络和治理规则，搭建出更宏伟的摩天大楼。
