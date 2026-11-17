# 贡献指南

这个仓库是 DSH 的娱乐中心插件，欢迎加模块、修样式、改文档。

## 动手前

- 想加玩法模块：先开个 issue 说清玩法、交互和数据存哪儿，避免写完才发现设计不搭。
- 改面板结构或契约（`src/shared/types.ts`、槽位 id）：先开 issue，这类改动会波及所有模块。

## 开发流程

```bash
pnpm install
pnpm check          # typecheck + 单测 + 构建 + 产物冒烟检查，PR 必须过
```

改完后在 DSH 里实际看一眼：`pnpm build` → 「插件」页 → 「添加插件」填本仓库绝对路径 → 左栏点开「娱乐中心」。只有构建通过、没在页面里看过，不算验证完成。

## 代码约定

- 文案一律走 `src/client/locales.ts`，中英两份同时加，`pnpm test` 会校验两份字典的 key 是否对齐、模块契约里的 title / description key 是否存在；组件内部自己的文案 key 要自己补渲染测试盯住。
- 样式颜色/字号/圆角只用 `--dsw-*` 主题 token，让开窗口顶部用 `--dsh-frame-top-clearance`；不写死色值，选择器统一 `dsc-club-` 前缀。
- 面板是全局面板，渲染时拿不到会话 props；要会话数据得用宿主提供的 session 服务或投影，别自己订阅 `session/event`。
- 注释写给下一个读代码的人：解释「为什么这样接」，不复述代码在做什么。
- 不引第三方 UI 库或 DSH 内部 Client 包；控件照宿主样式自己写。

## 提交

- 用中文写提交信息，一行说清改了什么，例如 `面板：新增空状态插画`。
- 一个 PR 只做一件事；顺手发现的问题另开 issue，不在本次改动里捎带修。

## 新增模块

照 [docs/modules.md](./docs/modules.md) 走：写组件、加字典 key、push 进注册表、补一条渲染测试。

## 安全问题

不要开公开 issue，按 [SECURITY.md](./SECURITY.md) 私密报告。
