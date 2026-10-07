# 架构与工程决策

ADR 保存背景、选择、替代方案、后果和复查条件；当前职责正文仍在设计与规则中维护。`accepted` 表示在明确范围内采用，不意味着用户已经批准所有未来依赖或外部操作。

| 决策 | 状态 | 范围 |
| --- | --- | --- |
| [ADR-0001 文档优先的 M0](0001-documentation-first.md) | accepted | 本次文档范围、正本与 GitBook 目录 |
| [ADR-0002 业务域与多语言](0002-domain-and-polyglot.md) | proposed | 后端与客户端主选设计，服务实现前验证 |
| [ADR-0003 单阶段提交与分支保护](0003-git-and-protection.md) | accepted | 本地阶段提交、远端初始化与最终保护 |
| [ADR-0004 开源缺陷学习闭环](0004-upstream-learning.md) | accepted | 记录、复现、反馈授权与升级回归 |

新增决定使用 [ADR 模板](../templates/decision-record.md)，替代决定保留新旧链接，不静默重写历史理由。
