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
pnpm check:bundle  # 构建产物冒烟检查（需要先 build）
pnpm check       # 上面几件一起跑，PR 前跑这个
```

`check:bundle` 会假装成 DSH 的客户端加载器执行 `lib/client.js`，核对模块 id 与包名一致、导出 `apply` / `inject`，再检查 `exports`、`files`、图标和 bundle patch 指向的文件都存在。它挡的是「构建成功但装上不生效」这类问题。

测试只覆盖不需要宿主的东西：文案字典是否对齐、模块注册表是否完整、面板空状态与模块分区能否渲染。需要宿主才能验证的部分（槽位是否出现、样式是否跟着主题）只能在 DSH 里看。

## 装进 DSH 看效果

1. `pnpm build`，确认 `lib/` 下有 `index.js` 和 `client.js`
2. 打开 DSH 的「插件」页，点「添加插件」
3. 在弹窗的输入框里填本仓库目录的**绝对路径**（当前版本是文本输入，不是文件选择器），确认安装
4. 左栏出现「娱乐中心」入口，点开看面板

本地目录安装是链接这份 checkout，不是复制。改完代码重新 `pnpm build`，再刷新页面；换了 `lib/` 里的产物通常要重启 DSH 才会加载新的模块代。

## 调试

- **入口不出现**：先看浏览器 DevTools 控制台有没有 `slot entry crashed`；再确认 `inject` 里的 `slots`、`locale` 在宿主组合里都有。
- **点了入口没反应**：`sidebar.panellist` 的 `id` 和 `main` 的 `key` 必须一模一样（都来自 `PANEL_ID`）。
- **样式没生效**：确认 `<head>` 里有带 `data-plugin="@kulebbb/dsh-club"` 的 `<style>`；类名统一 `dsc-club-` 前缀，别和宿主撞。
- **深浅色不对**：颜色/字号/圆角只用 `--dsw-*` token，写死颜色就不会跟着主题变；让开窗口顶部用 `--dsh-frame-top-clearance`。
- **文案不显示**：`ctx.locale.register(NS, ...)` 的命名空间要和槽位 `locale: NS` 一致，key 两边都要有。

## 发布

`pnpm publish`（`prepublishOnly` 会先跑一遍 `pnpm check`，所以构建不过发不出去）。`files` 里列了 `lib`、`locale`、`icon.svg`、`cordis.patch.yml`、`docs`、`README.md`、`LICENSE`；npm 本身也会强制打包 `LICENSE` 和 `README.md`。
