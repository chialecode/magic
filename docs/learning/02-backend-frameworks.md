# 四种后端框架与业务分工

## Gin：用社区学习 HTTP 与并发

Go 的 goroutine 让并发编程容易起步，但取消、超时和资源上限仍要明确。Gin 提供路由、中间件和请求绑定，适合保持 HTTP 层简单；业务事务与数据库权限仍由应用设计保障。

Magic 的帖子列表、编辑冲突、评论分页和关注请求可以逐步覆盖 context、连接池、错误映射和限流。相比标准库，Gin 提供常见约定；相比更大的微服务套件，它不会同时引入注册中心等额外概念。

待做实验：取消一个慢查询请求，观察数据库调用能否取消；并发编辑同一帖子，验证不会静默覆盖；对比有无缓存的延迟与失效行为。实现入口为未来 `services/magic/`。

官方资料：[Gin](https://gin-gonic.com/en/docs/)、[Go context](https://pkg.go.dev/context)。

## FastAPI：用资料站学习类型与任务

FastAPI 根据类型化模型处理输入和 OpenAPI，适合与 Python 的数据清洗和检索工具结合。`async` 不会自动使同步数据库或 CPU 密集处理变成非阻塞；长任务需要工作进程和可持久化任务状态。

Akasha 的实体修订、来源抽取和批量导入能学习模型校验、事务与任务恢复。Django 提供更完整的一体化后台；当前选择 FastAPI，是为了清楚观察 API、任务和资料模型之间的边界。

待做实验：导入 1,000 条合成词条，中断任务后重启，验证已完成数据不重复、错误可定位；确认资料阅读不会被同步处理阻塞。入口为未来 `services/akasha/`。

官方资料：[FastAPI](https://fastapi.tiangolo.com/)、[SQLAlchemy](https://docs.sqlalchemy.org/)。

## Spring Boot：用商城学习事务

Spring Boot 将常见依赖与运行配置集成到可启动应用；事务能力需要理解实际代理、数据库隔离和异常回滚规则，不能仅加注解就假设所有调用都有事务。

Grail 把余额、库存、订单和权益放在一个数据库边界内，适合实践约束、锁、幂等和补偿流水。ORM 方便对象映射，但列表查询、批量操作和锁定更新仍需关注生成 SQL 及 N+1 问题。

待做实验：并发兑换最后一个库存；同一幂等键重复与变更参数提交；事务中途制造失败；核对账户和流水。与 Quarkus 的比较可聚焦启动资源和生态取舍，而不是为比较重新复制商城。入口为未来 `services/grail/`。

官方资料：[Spring Boot](https://docs.spring.io/spring-boot/index.html)、[Spring 事务](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)。

## Axum：用资源处理学习异步与边界

Axum 基于 Tokio / Tower，将请求提取、响应和中间件组合起来。Rust 的所有权有助于资源生命周期表达，但不会自动限制请求体、解压内存或阻塞任务，需要显式设计限额和并发。

Imaginary 的上传、清单校验、摘要和流式分发适合学习背压、取消与错误转换。Actix Web 是成熟替代；当前主选 Axum 侧重 Tokio 生态一致性，性能结论以实际负载为准。

待做实验：大文件流式传输时取消客户端；构造超限或路径穿越资源包；模拟权益服务超时；观察内存、临时文件和错误响应。入口为未来 `services/imaginary/`。

官方资料：[Axum](https://docs.rs/axum/latest/axum/)、[Tokio](https://tokio.rs/tokio/tutorial)。
