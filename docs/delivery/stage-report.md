# 当前阶段报告

阶段：M0 文档与架构基础。日期：2026-10-07。分支：`docs/m0-foundation`。范围：本地文档工程及已授权远端基础配置。验证环境为 Windows、Node.js 24.19.0 和 pnpm 12.8.1。

## 交付结果

完成需求调整、架构与主栈设计、领域事务和接口约定、多端与部署方案、六章技术学习手册、上游缺陷流程与台账，以及开发规范、文档治理、GitHub 模板和检查工具。

根提交为 `0a6d0c2`，仅包含空 README。M0 全部内容保存在其后的一个阶段提交中，可用 `git log --oneline main..docs/m0-foundation` 定位；根提交保持不变。

## 实际验证

| 项目 | 结果 | 范围 |
| --- | --- | --- |
| Git 根树检查 | passed | 只有 README，blob 大小为 0 |
| 文档依赖安装 | passed | Node.js 24.19.0、pnpm 12.8.1，生成锁文件 |
| 锁定依赖复核 | passed | `pnpm install --frozen-lockfile` 成功且不改锁文件 |
| 干净暂存快照 | passed | 导出暂存树，在隔离目录使用缓存离线安装锁定依赖并运行全套检查；不依赖未入库文件 |
| 检查脚本回归 | passed | 9 个成功与失败路径测试，无跳过 |
| 完整文档门禁 | passed | `node scripts/verify.mjs`；46 个 Markdown 的格式、登记、链接、配置与回归 |
| 远端设置回读 | passed | 基础 ruleset active、无 bypass、仅 squash；证据见配置记录 |
| GitHub CI 与 PR | not-run | 用户已授权推送、创建 PR、检查通过后合并和清理分支，正在接线 |
| 产品与部署 | not-run | 尚未实现，不属于 M0 文档交付 |

自审中修正了两个本项目接入错误：锁文件解析支持 pnpm 12 的多文档 YAML；格式检查调用 markdownlint 的实际 CLI 入口。分别增加多文档／重复键测试与 CLI 失败反例，未将这些错误登记为上游框架缺陷。

GitHub M0 里程碑已创建；远端 ruleset ID 为 `24635292`，实际配置快照在 `docs/evidence/github-settings.json`，完整保护方案尚待真实 CI 成功后应用。

## 调研与限制

官方来源快照已保存；发现 Flutter GitHub release 元数据不适合作为 stable SDK 版本，旧发布清单地址不可用，已说明后续按官方渠道锁定。许可证自动识别不足的组件需要在正式引入时复核发布物。

文档与脚本自审由当前开发者完成，没有独立 Agent 审查。未运行在线 GitBook 渲染、产品、设备、部署或性能验证。完整 main PR／CI 门禁待首次实际 CI 成功后启用；当前基础保护不禁止普通快进直推。

干净快照复验发生在 Windows，使用本机已有包缓存；不等于 Linux CI 或无缓存网络安装已验证。后续报告文字同步后再次运行统一检查。

用户事项统一见 [USER-ACTIONS](../../USER-ACTIONS.md)，没有对上游发送任何缺陷报告或评论。
