# 技术栈与采用状态

本页维护主栈和引入条件；原理与替代方案见 [学习手册](../learning/README.md)。只有文档工具已在 M0 接入，产品框架均为设计主选，未安装或运行。

## 1. 后端与客户端主选

| 领域 | 主选 | 选择依据 | 替代方案与代价 |
| --- | --- | --- | --- |
| 社区 | Go / Gin | 生态成熟、HTTP 层简单，适合学习并发和 API 服务 | 标准库更少依赖；Echo 功能完整；切换需验证中间件与绑定语义 |
| 资料 | Python / FastAPI | 类型化 API、OpenAPI、Python 数据处理生态 | Django 适合一体化后台；会改变应用结构与 ORM 习惯 |
| 商城 | Java / Spring Boot | 事务、持久化、测试与运营能力生态广泛 | Quarkus 在启动与容器方向有价值，当前优先 Spring 学习资源 |
| 资源 | Rust / Axum | Tokio / Tower 组合、流式处理、显式错误与资源边界 | Actix Web 同样成熟，需比较 middleware 与异步生态成本 |
| 社区 Web | Vue / Nuxt / TypeScript | SSR、路由和内容型页面组织 | Vue + Vite 更简单，但需补 SSR 与约定 |
| 商城 Web | React / Next.js / TypeScript | React 主栈与完整应用框架实践 | React + Vite 可降低服务器层复杂度，需独立解决 SSR |
| 移动与桌面 | Flutter / Dart | 一个生态覆盖多个平台，适合共享资源与主题逻辑 | 原生、React Native、Tauri 为后续专题，避免同时维护重叠正式客户端 |
| 微信小程序 | Taro / React / TypeScript | 复用 React 知识和独立平台适配 | uni-app 是 Vue 路线，当前用 Taro 形成清晰 React 实践场景 |

## 2. 原生工程配套

| 生态 | 建议工具 | 约束 |
| --- | --- | --- |
| Java | Java LTS、Gradle Wrapper、Spring Data JPA、Flyway、JUnit、Spotless | 具体 JDK／框架组合在创建服务时锁定并验证 |
| Go | Go modules、gofmt、go vet、golangci-lint、pgx；按需 sqlc | 不为简单模块强制采用大型框架套件 |
| Python | uv、Ruff、mypy、pytest、SQLAlchemy、Alembic | HTTP handler 不承担长时间导入；独立工作任务可恢复 |
| Rust | Cargo、rustfmt、Clippy、Tokio、SQLx | 限制阻塞工作与内存；外部输入不用 panic 处理 |
| Web / 小程序 | pnpm、TypeScript、ESLint、Vitest；按需 Playwright | 验证 SSR 与浏览器边界，不混用客户端和服务端秘密 |
| Flutter | Dart formatter、flutter analyze、flutter test | 目标平台构建与真机验收分开记录 |

## 3. 基础组件引入顺序

| 组件 | 用途 | 采用门槛 |
| --- | --- | --- |
| PostgreSQL | 各领域权威数据 | 业务持久化开始时引入，分库与最小权限 |
| Keycloak | OIDC、统一账号、GitHub 上游登录 | 验证 Web、移动及本地演示登录；评估内存和升级成本 |
| Caddy | 入口、路由与 TLS | 首个部署闭环引入，区分本地 HTTP 与公网域名 |
| SeaweedFS / S3 兼容接口 | 附件和资源对象 | 验证预签名、分片、摘要和权限所需子集，不以兼容名称推断全部行为 |
| Valkey | 缓存与限流 | 有明确缓存失效及一致性设计后接入 |
| RabbitMQ | 可靠跨域事件 | 存在可恢复投递需求，并完成 Outbox、幂等与重放用例 |
| OpenSearch | 中文全文检索与相关性 | PostgreSQL 基线实测无法满足中文用例后再引入 |
| OpenTelemetry / Prometheus / Grafana | 追踪、指标与展示 | 基础日志先行，完整监控通过可选部署配置加载 |

## 4. M0 已采用的文档工具

Node.js 24.19.0、pnpm 12.8.1、markdownlint-cli2 0.23.3、markdown-it 15.0.2、github-slugger 2.0.0、yaml 2.9.1。具体锁文件为 `pnpm-lock.yaml`，所有这些依赖只用于文档和仓库治理。

采用成熟解析器处理 Markdown 与 YAML，只自编写本项目的文档登记、相对链接和工作流规则检查。检查脚本必须有反例测试。GitBook 使用静态目录配置，当前没有在线 Space 或 Git Sync 安装。

## 5. 来源、版本与维护判断

2026-10-07 查询的 [GitHub 来源快照](../learning/evidence/technology-sources.json)记录官方仓库、归档状态、最新发布元数据、许可证识别和活动日期。快照不是依赖锁文件，查询时的最新版本也不自动成为产品版本。

注意来源的适用边界：Flutter 的 GitHub `releases/latest` 返回了旧的预发布标签，不能作为 stable SDK 的依据；本次尝试的历史 Windows 发布清单地址不可用，版本需在进入客户端实现时按 [官方 SDK archive](https://docs.flutter.dev/install/archive)和实际工具链复核。Taro、RabbitMQ 的许可证自动识别为 `NOASSERTION`，需要阅读对应发布物的许可文件，不能推断其没有许可证或任意使用。

新依赖必须记录官方文档、仓库、发布和安全公告来源，评估实际功能、维护历史、许可证、兼容性和退出成本。不以 Star 数、一次推送时间或自动“latest”字段独立决定选型。

升级先读发布说明，运行相关回归和已登记上游问题的复现；旧 workaround 只有在测试证明不再需要后移除。主版本升级与框架替换通过 ADR 记录。
