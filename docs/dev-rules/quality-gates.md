# 质量门禁与实际命令

## 1. M0 可执行入口

前置：Node.js 24.19.0、pnpm 12.8.1。首次准备执行 `pnpm install --frozen-lockfile`，检查执行 `node scripts/verify.mjs`。

| 命令 | 实际范围 |
| --- | --- |
| `pnpm docs:lint` | markdownlint 格式检查 |
| `node scripts/check-docs.mjs` | 自有 Markdown 登记、相对链接和本地锚点、越界路径 |
| `node scripts/check-config.mjs` | JSON／YAML 解析、GitBook 入口、工作流与 ruleset 检查名称、有限公开内容检查 |
| `node --test scripts/check-docs.test.mjs` | 检查脚本的成功与失败回归 |
| `node scripts/verify.mjs` | 顺序运行以上全部检查，任一步失败即非零退出 |

配置检查包括 PR 指向 main、必需 job 没有路径过滤、Actions SHA 固定、只读 contents、无永久 bypass actor、CI pnpm 版本与清单一致。解析配置不代表已在 GitHub 运行。

公开内容检查仅识别有限的个人路径、GitHub 凭据和私钥模式，错误不回显匹配内容。它不是完整秘密扫描器，不检查所有 Git 历史或第三方依赖安全；提交前仍需核对待公开文件与差异。

## 2. 文档与脚本验收

新增或移动文档同步登记、阅读目录和受影响链接。修改检查脚本至少验证相关成功与反例；当前覆盖断链、缺失锚点、越界路径、登记遗漏／重复、CI 状态错配及有限秘密模式。

自动检查不验证需求语义、外部链接持续有效、Mermaid 视觉渲染或在线 GitBook。自审核对正本冲突、来源证据和是否准确区分计划与实现。

## 3. 后续产品门禁

业务实现后按风险增加单元、真实数据库集成、契约、端到端和目标平台检查。订单与积分验证并发、幂等、退款及故障；资源验证输入限制、权益及取消；多端验证真实构建和设备支持。

缺少命令时标记未实现或未执行，不能通过 `--if-present` 把缺失门禁算成成功。纯文档不运行无关设备或性能测试。

## 4. 提交与远端

提交前运行 `git diff --cached --check`，核对阶段范围和 sign-off。验证工作区通过后，确保提交内容与被测版本一致；提交本身不改变源码，不必仅因新 SHA 重跑相同检查。

远端使用同一验证入口，但结果以真实 workflow run 为准。规则 JSON 与远端生效状态分别记录；M0 首次 PR 前没有远端 CI 证据。

Dependabot 配置暂将版本更新 PR 上限设为 0，避免未经约定自动创建 PR；未来启用自动依赖 PR 或安全更新前单独明确授权与处理流程。
