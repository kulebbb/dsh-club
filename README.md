# dsh-club · DSH 娱乐中心

[![CI](https://github.com/kulebbb/dsh-club/actions/workflows/ci.yml/badge.svg)](https://github.com/kulebbb/dsh-club/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> DeepSeek Harness 左侧边栏里的娱乐面板：等 agent 干活的空隙，来这儿坐一会儿。

**当前状态：v0.1 骨架。** 类型检查、单元测试、构建和产物冒烟检查（`pnpm check`）都已通过，但**还没有在 DSH 里实际安装验证过**——侧栏入口、面板实际长什么样、深浅主题，都还没实测。面板目前渲染的是「还没开张」的空状态，具体玩什么也没定。

## 它是什么

一个 DSH 插件（bundle）。装进 Harness 后，左栏多一个「娱乐中心」入口，点开是一整块中央面板：

- **纯前端**：不请求任何后端，也不进模型上下文——开着它不花 token；
- **容器式**：面板只提供外框、标题和留白，玩法模块是独立组件，自己管状态与布局；
- **跟着宿主走**：颜色、字号、圆角全用 `--dsw-*` 主题 token，深浅色自动切换；文案中英双语。

现在模块注册表是空的（`src/client/modules.ts`），所以面板显示空状态。往里加小游戏、摸鱼电台或「让 agent 陪你玩一局」，流程见 [docs/modules.md](./docs/modules.md)。

## 安装

DSH 目前从本地目录装插件。先构建出 `lib/`，再在「插件」页点「添加插件」，输入框里填本仓库的**绝对路径**：

```bash
pnpm install
pnpm build     # 产物在 lib/：index.js（宿主半）+ client.js（浏览器半）
```

```text
/你的路径/dsh-club
```

> 本地目录安装是链接这份 checkout、不是复制，所以改完代码要重新 `pnpm build` 再刷新页面。这一步尚未实测，细节见 [docs/development.md](./docs/development.md)。

从 npm 安装：包名 `@kulebbb/dsh-club`，还没发布。

## 开发

```bash
pnpm install
pnpm check     # typecheck + 单测 + 构建 + 产物冒烟检查
pnpm test      # 只跑单测
pnpm build     # 只构建到 lib/
```

环境：Node `^22.19.0 || >=24`，pnpm 11。调试方法见 [docs/development.md](./docs/development.md)。

## 仓库结构

```
src/
  index.ts            宿主半入口（目前为空，等需要本地存档 / agent 参与时再长）
  shared/types.ts     模块契约：ClubModule
  client/
    index.tsx         槽位接线：侧边栏入口 + main 面板
    views/Panel.tsx   面板：有模块按序渲染组件，没有就空状态
    modules.ts        娱乐模块注册表（现在是空数组）
    locales.ts        中英文案
    styles.ts         面板样式（只用主题 token）
    dsh.ts            DSH 客户端服务的最小类型声明
scripts/check-bundle.mjs  构建产物冒烟检查（id / 导出 / 清单）
locale/               Plugin Manager 读的展示元数据（zh / en）
docs/                 架构、开发、模块契约、路线图
tests/                文案一致性、模块注册表、面板渲染
```

## 文档

从 [docs/README.md](./docs/README.md) 进。想直接动手：加模块看 [docs/modules.md](./docs/modules.md)，改结构看 [docs/architecture.md](./docs/architecture.md)。

## 路线图

- **v0.1 骨架**（当前）：面板、契约、构建、CI、产物检查。
- **待定**：具体内容方向（小游戏 / 电台 / 陪玩 / 成就），见 [docs/roadmap.md](./docs/roadmap.md)。
- **不做**：联网排行榜、后端服务、第三方素材。

## 贡献

提 issue 说想法、提 PR 加模块都欢迎，先看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## English

dsh-club is a club panel for DeepSeek Harness: a sidebar entry that opens a central panel for entertainment modules. This is a v0.1 skeleton — the panel renders an empty state, the module contract is in place, and the content is still undecided. It runs entirely in the browser, makes no network calls, and never touches model context. See [docs/architecture.md](./docs/architecture.md) for the two-half structure and slot wiring.

## License

[MIT](./LICENSE) © 2026 kulebbb
