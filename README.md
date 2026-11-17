# dsh-club · DSH 娱乐中心

[![CI](https://github.com/kulebbb/dsh-club/actions/workflows/ci.yml/badge.svg)](https://github.com/kulebbb/dsh-club/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> DeepSeek Harness 左侧边栏里的娱乐面板：等 agent 干活的空隙，来这儿坐一会儿。

**当前状态：骨架版本（v0.1）**。面板、模块契约、构建与安装链路已经跑通；具体玩什么还没定，所以打开看到的是「还没开张」。

## 它是什么

一个 DSH 插件（bundle）。装进 Harness 后，左栏多一个「娱乐中心」入口，点开是一整块中央面板：

- **纯前端**：不请求任何后端，也不进模型上下文——开着它不花 token；
- **容器式**：面板只提供外框、标题和留白，玩法模块自己渲染主体，互不抢布局；
- **跟着宿主走**：颜色、字号、圆角全用 `--dsw-*` 主题 token，深浅色自动切换；文案中英双语。

现在模块注册表是空的（`src/client/modules.ts`），所以面板显示空状态。往里加小游戏、摸鱼电台或「让 agent 陪你玩一局」，流程见 [docs/modules.md](./docs/modules.md)。

## 安装

### 从本地目录安装

DSH 目前从本地目录装插件：

```bash
pnpm install
pnpm build     # 产物在 lib/：index.js（宿主半）+ client.js（浏览器半）
```

构建完成后，在 DSH 的「插件」页选择「添加插件」，选中本仓库目录即可。装好后左栏出现「娱乐中心」，点开即用。

### 从 npm 安装

包名 `@kulebbb/dsh-club`，尚未发布。

## 开发

```bash
pnpm install
pnpm check     # typecheck + 单测 + 构建
pnpm test      # 只跑单测
pnpm build     # 只构建到 lib/
```

环境：Node `^22.19.0 || >=24`，pnpm 11。命令细节和调试方法见 [docs/development.md](./docs/development.md)。

## 仓库结构

```
src/
  index.ts            宿主半入口（目前为空，等需要本地存档 / agent 参与时再长）
  shared/types.ts     模块契约：ClubModule
  client/
    index.tsx         槽位接线：侧边栏入口 + main 面板
    views/Panel.tsx   面板：有模块按序渲染，没有就空状态
    modules.ts        娱乐模块注册表（现在是空数组）
    locales.ts        中英文案
    styles.ts         面板样式（只用主题 token）
    dsh.ts            DSH 客户端服务的最小类型声明
locale/               Plugin Manager 读的展示元数据（zh / en）
docs/                 架构、开发、模块契约、路线图
tests/                文案一致性与面板渲染的冒烟测试
```

## 文档

从 [docs/README.md](./docs/README.md) 进。想直接动手：加模块看 [docs/modules.md](./docs/modules.md)，改结构看 [docs/architecture.md](./docs/architecture.md)。

## 路线图

- **v0.1 骨架**（当前）：面板、契约、构建、CI。
- **待定**：具体内容方向（小游戏 / 电台 / 陪玩 / 成就），见 [docs/roadmap.md](./docs/roadmap.md)。
- **不做**：联网排行榜、后端服务、第三方素材。

## 贡献

提 issue 说想法、提 PR 加模块都欢迎，先看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE) © 2026 kulebbb
