# 数据、一致性与基础组件

## PostgreSQL 与交易边界

每个服务拥有自己的数据；同机分库可以降低成本，但不能允许服务互相写表。Grail 的积分与权益放在同一本地事务，是为了让重复请求、库存竞争和失败回滚有可证明的边界。

待做实验：以真实数据库并发执行兑换，观察隔离级别、唯一约束与条件更新；对比应用检查后写入和数据库原子约束的差异。仅用 mock 数据库无法证明这些性质。

## Outbox 解决什么

数据库提交和消息发送是两个动作。若先提交后宕机，事件可能丢失；若先发送再回滚，消费方可能处理一个从未完成的业务。

Outbox 将事件与业务状态一起保存，再异步投递。它解决可恢复发布，但不消除重复；消费方仍需要 Inbox 或业务幂等键。RabbitMQ 提供投递和确认能力，不替应用保证“恰好一次业务效果”。

待做实验：在数据库提交后、发送前中断生产方；在消费提交后、确认前中断消费方，最终奖励应只发放一次。

## 身份、缓存和对象存储

Keycloak 处理身份与会话协议，业务服务处理资源权限；Valkey 可保存缓存和限流状态，但不是积分权威数据；S3 兼容存储负责对象，不决定用户是否购买。

预签名链接在有效期内可能继续可用，因此权益撤销和已下载文件不能假设即时回收。SeaweedFS 的具体 API 子集要实测；兼容名称不替代行为验证。

## 搜索与可观测性

PostgreSQL 能提供初步搜索，但中文分词和相关性需要中文样本验证。搜索引擎索引是可重建投影，权限变更后不能继续展示受限正文。

OpenTelemetry 统一跨服务追踪；指标用于观察延迟、错误和积压。实验应同时测量资源成本和故障恢复，不仅展示成功请求的速度。

正式约束见 [领域模型](../design/domain-model.md)及 [API 与事件](../design/api-and-events.md)。官方资料：[PostgreSQL](https://www.postgresql.org/docs/)、[RabbitMQ](https://www.rabbitmq.com/docs)、[Keycloak](https://www.keycloak.org/documentation)、[Valkey](https://valkey.io/)、[SeaweedFS](https://github.com/seaweedfs/seaweedfs)、[OpenTelemetry](https://opentelemetry.io/docs/)。
