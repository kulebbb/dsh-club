# 开发

## 环境

- Node `^22.19.0 || >=24`
- pnpm 11（`corepack enable` 或自行安装）
- 一个装了本插件的 DSH，用来看实际效果

## 常用命令

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
pnpm build       # tsdown：lib/index.js + lib/client.js
pnpm check       # 上面三件一起跑，PR 前跑这个
```

测试只覆盖不需要宿主的东西：文案字典是否对齐、面板空状态与模块分区能否渲染。需要宿主才能验证的部分（槽位是否出现、样式是否跟着主题）只能在 DSH 里看。

## 装进 DSH 看效果

1. `pnpm build`
2. 打开 DSH 的「插件」页，选「添加插件」，挑本仓库目录
3. 左栏出现「娱乐中心」入口，点开看面板

改完代码后重新 `pnpm build`，再刷新页面。换了 `lib/` 里的产物通常要重启 DSH 才会加载新的模块代。

## 调试

- **入口不出现**：先看浏览器 DevTools 控制台有没有 `slot entry crashed`；再确认 `inject` 里的 `slots`、`locale` 在宿主组合里都有。
- **点了入口没反应**：`sidebar.panellist` 的 `id` 和 `main` 的 `key` 必须一模一样（都来自 `PANEL_ID`）。
- **样式没生效**：确认 `<head>` 里有带 `data-plugin="@kulebbb/dsh-club"` 的 `<style>`；类名统一 `dsc-club-` 前缀，别和宿主撞。
- **深浅色不对**：只允许用 `--dsw-*` token，写死颜色就不会跟着主题变。
- **文案不显示**：`ctx.locale.register(NS, ...)` 的命名空间要和槽位 `locale: NS` 一致，key 两边都要有。

## 发布

`pnpm publish`（`prepublishOnly` 会先构建）。发布前确认 `files` 里的内容齐全：`lib`、`locale`、`icon.svg`、`cordis.patch.yml`、`docs`、`README.md`、`LICENSE`。
