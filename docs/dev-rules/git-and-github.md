# Git 与 GitHub 协作

仓库：[chialecode/magic](https://github.com/chialecode/magic)。默认分支 `main`。本页区分期望配置和远端实际状态，远端回读证据见 [配置记录](../evidence/github-settings.json)。

## 1. 提交与授权

一个阶段一个分支、一个阶段提交、一个 PR。空 README 根提交是一次性初始化，不计入 M0。M0 使用 `docs/m0-foundation`；后续分支采用 `feat/`、`fix/`、`docs/` 或 `chore/` 加目标名称。

阶段首次交付和自检后创建本地提交，之后未推送的同阶段修改 amend；不按文件、角色、工作包或审查轮次增加阶段提交。不同阶段保持不同提交。

已推送历史不得自动改写。需要修复时默认追加集中修复，再通过 squash 使 main 上每阶段一个提交；若要改写远端，必须单独授权并验证目标旧 SHA，使用明确分支的 `--force-with-lease`，不能擅自覆盖他人工作。

提交前核对工作区和暂存内容，按归属明确的路径添加；运行检查和 `git diff --cached --check`。消息采用 `type(scope): 具体结果`，正文说明原因、验证和限制。使用已有 Git 身份，通过 `git commit -s` 添加 DCO sign-off；sign-off 不等同于 GPG 签名。

本地实现、检查、暂存和阶段 commit 可在当前开发授权内连续完成。push、创建 PR、合并、发布、安装外部 App 和向上游发消息分别按明确授权执行，许可不互相推导。没有批准时保留完整的本地可审阅结果。

## 2. 空仓库初始化与保护收敛

采用两个保护配置，更新同一远端 ruleset，避免永久管理员绕过：

1. 空仓库先启用 [bootstrap](../../.github/rulesets/bootstrap.json)：禁止删除 main、禁止非快进、要求线性历史，无 bypass actor；允许创建初始分支。
2. 用户授权后，仅推送空 README 的本地 main，再推送 M0 分支并创建 PR。基础保护阶段还不能阻止普通快进直推，维护者必须遵守本页授权与 PR 规则。
3. 首个 PR 真实产生成功的 `repository-quality` 后，将同一 ruleset 更新为 [main](../../.github/rulesets/main.json) 并回读验证。
4. 最终保护要求 PR、解决 review threads、GitHub Actions 的必需检查及线性历史。当前单人维护，批准人数为 0、无强制 code-owner approval，无常驻 bypass actor。
5. 合并需要明确用户授权；会话已经包含合并授权时直接复用，不能仅从配置保护或推送授权推导。

未来检查更名也先让新检查产出，再切换 ruleset。不得因为 CI 失败自动删除保护或跳过验证。

## 3. 仓库设置与 CI

[仓库配置](../../.github/repository-settings.json)仅允许 squash，关闭自动合并，合并后清理远端分支。CODEOWNERS 表达责任归属，不假设存在其他审批人。

工作流名 `CI`，固定 job／状态名 `repository-quality`；面向 main 的 PR 与手动触发，无路径过滤，无自动定时任务或 main push 重复检查。只读 contents 权限，checkout 不保留凭据，Actions 固定完整 SHA。

CI 使用锁文件安装并运行同一个 `node scripts/verify.mjs`。M0 不构建业务镜像、发布站点或运行未实现应用。[首次远端 CI](https://github.com/chialecode/magic/actions/runs/37592466838)已成功，完整 main 保护已经启用；每次合并仍核对当前 PR 提交的真实检查结果。

GitHub App ID 15368 已通过 API 确认为 `github-actions`；必需检查绑定此 App。JSON 是可审阅配置，不会因提交到仓库而自动应用。

## 4. 低干扰协作

合并前使用 Issues、PR、Milestones 和 Projects 追踪目标，阶段内集中推送，不为可在本地诊断的问题反复 push。不要自动发送评论、启动定时轮询或批量创建上游问题。

GitBook 配置只准备 Git Sync 目录，GitHub Pages、Space、App 和域名接入另行授权。私有信息、第三方源码和许可选择在公开前检查。
