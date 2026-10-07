# Magic

以型月世界观与二次元内容为主题、以开发者技术学习为主要目标的社区项目。

**Magic + Akasha + Grail + Imaginary + Circuit** 表达项目的产品模块；**Manga + Anime + Game + Illust + Circle** 表达内容范围。

项目规划覆盖论坛、资料站、数字内容商城，以及 Web、移动端、小程序和桌面端。在一个 Monorepo 中，以真实业务逐步实践 Java、Go、Python、Rust、Vue、React 和 Flutter。

这是一个长期演进项目，需求和技术选型允许在实践中调整。长期原则、当前迭代承诺与未来候选需求分开管理，按小型业务闭环持续交付。

当前为 M0：文档与架构基础。已有架构设计、技术学习手册、开发规范、上游缺陷记录流程和可执行文档检查；业务服务、客户端及部署脚本均待实现。

- [文档导航](docs/README.md)与 [GitBook 目录](docs/SUMMARY.md)
- [项目原则](docs/product/principles.md)与 [需求基线](docs/requirements.md)
- [总体架构](docs/design/architecture.md)与 [技术栈](docs/design/technology-stack.md)
- [技术学习手册](docs/learning/README.md)与 [上游缺陷台账](docs/upstream/README.md)
- [开发入口](AGENTS.md)、[贡献指南](CONTRIBUTING.md)与 [用户待办](USER-ACTIONS.md)
- [执行状态](docs/delivery/status.md)与 [路线和验收](docs/delivery/roadmap-and-acceptance.md)
- [技术学习需求模板](docs/templates/technology-proposal.md)
- [需求变更模板](docs/templates/change-proposal.md)

首期商城使用演示积分，数字内容仅限站内使用。部署方案暂按单机 Docker Compose 设计，后续可扩展 Kubernetes。

## 文档检查

前置：Node.js 24.19.0 与 pnpm 12.8.1。

```sh
pnpm install --frozen-lockfile
node scripts/verify.mjs
```

一个阶段一个提交；push、PR、合并分别遵守用户授权。发现疑似开源框架 bug 时保留最小复现与版本记录，未经授权不向上游发送问题。

仓库：[chialecode/magic](https://github.com/chialecode/magic)。GitBook 阅读配置已准备，在线 Space 尚未接入。
