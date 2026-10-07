# Magic 开发与贡献

先读 [AGENTS.md](AGENTS.md)、[文档导航](docs/README.md)和 [执行状态](docs/delivery/status.md)。当前交付文档工程，业务应用尚未建立。

## 本地环境

使用 `.node-version` 指定的 Node.js 与 `package.json` 中锁定的 pnpm 版本。安装 pnpm 是本机前置步骤，仓库不会自动修改其他项目的全局配置。

```sh
pnpm install --frozen-lockfile
node scripts/verify.mjs
```

文档编辑通过检查即可，不需要提前安装四种后端语言。各业务进入实现时再增加对应工具链与锁定版本。

## 完成一次变更

1. 找到当前阶段、需求编号和验收条件，阅读受影响正本。
2. 新技术先做开源调查与边界设计；复杂变化记录 ADR，局部修复在 Issue 或 PR 说明即可。
3. 实现与文档同步，疑似框架缺陷进入 [上游缺陷台账](docs/upstream/README.md)。
4. 运行相关检查并按 [REVIEW.md](REVIEW.md)自审，保存一个带 DCO sign-off 的本地阶段提交。
5. 在用户授权后推送并创建阶段 PR；合并还需单独授权。

未推送的同阶段修复 amend；已推送修复先保留历史，阶段最终通过 squash 集成为一个提交。禁止擅自强推以满足形式上的提交数量。

当前尚未选择仓库整体开源许可证；公开托管不代表已授予任意复用许可。选择前不复制第三方源代码。依赖按自身许可证使用并保留相应声明，素材许可独立管理。
