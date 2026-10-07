# Magic 技术学习手册

本目录以书籍形式解释“要解决什么问题、为什么这样选择、如何验证、何时替换”。它不是框架 API 的复制品，也不把未运行的示例写成成功经验。

## 建议阅读顺序

1. [学习方法与选型证据](01-method.md)：如何把兴趣变成可验证需求。
2. [四种后端与业务分工](02-backend-frameworks.md)：Gin、FastAPI、Spring Boot、Axum 的适配理由与边界。
3. [Web 与多端](03-frontends-and-clients.md)：Nuxt、Next.js、Flutter、Taro 如何合作。
4. [数据、一致性与基础组件](04-data-and-infrastructure.md)：事务、Outbox、身份、对象存储和搜索。
5. [Monorepo、交付与可观测性](05-engineering-and-delivery.md)：原生工具链如何形成统一工程入口。
6. [框架缺陷调查](06-debugging-upstream.md)：从现象形成最小复现和可复核结论。

正式技术选择和采用状态以 [技术栈](../design/technology-stack.md)与 ADR 为准；每章链接实际应用位置。新增主题使用 [技术提案](../templates/technology-proposal.md)，完成后补实测版本、命令、结果与适用范围。

当前章节是设计与实验指南，业务实验尚未运行。文档检查工程的实际验证见 [阶段报告](../delivery/stage-report.md)。原始来源快照见 [技术来源](evidence/technology-sources.json)。
