# 用户待办

本页只记录需要用户决定、授权或配置的事项；开发进展见 [执行状态](docs/delivery/status.md)。已有授权无需重复批准。

## ACT-001：初始化、M0 推送、PR、合并与分支清理

状态：已授权。依据：2026-10-07 用户明确同意推送、创建 PR，在 CI/CD 没有问题后合并并清理分支。

授权范围：推送本地 `main` 的空 README 根提交，再推送 `docs/m0-foundation` 的 M0 阶段提交，创建目标为 `main` 的 M0 PR；检查并修复 CI 问题，成功后启用完整保护、squash 合并，清理对应远端和本地阶段分支。执行结果记录在阶段报告与 GitHub PR。此授权不包含产品发布或 GitBook App 安装。

远端基础保护可在空仓库启用；完整 PR 与必需 CI 保护应在首次 PR 的 `repository-quality` 成功产出后启用，见 [Git 规则](docs/dev-rules/git-and-github.md)。保护配置已获授权，不额外重复请求配置许可。

## Q-001：仓库整体开源许可证

状态：待决定，非阻塞文档工程。建议 Apache-2.0；当前不擅自授予仓库内容的整体许可证，也不导入第三方项目源码。确认后补 `LICENSE` 和必要声明。内容素材与第三方依赖继续按各自许可管理。

## CFG-001：在线 GitBook

状态：可选，非阻塞。仓库提供 Markdown 目录、阅读顺序及 `.gitbook.yaml`，可以直接在 GitHub 阅读。若需要在线 GitBook Space，再由用户选择账号、Space 和公开范围，并授权 Git Sync App。当前不安装外部 App、不发布站点。
