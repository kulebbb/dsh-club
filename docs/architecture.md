# 架构

一句话：**宿主半留空，浏览器半在 DSH 的槽位里画一块面板，玩法模块通过一个小契约挂上去。**

## 两半结构

DSH 插件（bundle）由 `cordis.patch.yml` 插入一行插件，包本身导出两半：

| 半 | 文件 | 干什么 |
| --- | --- | --- |
| 宿主（Node） | `src/index.ts` → `lib/index.js` | 现在只有空的 `apply()`，让 bundle 行有可解析的导出 |
| 浏览器 | `src/client/index.tsx` → `lib/client.js` | 注册侧边栏入口与中央面板，注入样式和中英文文案 |

浏览器半按 DSH 客户端模块加载器的约定包装：`window.__ModuleLoader__.load({ id, factory })`，`id` 必须等于 `package.json` 的 `name`（`@kulebbb/dsh-club`）。`package.json` 的 `dsh.client.platform = "web"` 让宿主发现这个半。

宿主半为什么空着：面板不需要服务端能力。等要存本地战绩文件、或让 agent 读战绩/发挑战时，宿主半才从这里长出来（走 `connection` 路由或 `tools`）。

## 槽位接线

```
sidebar.panellist ──(id: 'club')──> 左栏入口
main ──(key: 'club')──> 中央面板
```

- `sidebar.panellist` 是 list 槽位：`id` 是入口身份，`order: 30` 排在插件(0)、自动化任务(10)、Skill 管理(20) 之后。
- `main` 是 keyed 槽位：`key` 必须等于侧边栏的 `id`，点入口才切得过来。两者写岔的表现是「点了没反应」。
- 两个 `register` 都包在 `ctx.slots.inject(槽位名, ...)` 里：槽位存在才注册，宿主没这个槽位时整块静默跳过，不会留死入口。
- 两层依赖门禁：导出的 `inject = ['slots', 'locale']` 让整个客户端插件只在服务齐备时激活；`apply` 里再 `ctx.inject` 一次兜底。缺服务时插件不出现，而不是半初始化报错。

样式用一段 CSS 字符串在 `apply` 里插到 `<head>`，带 `data-plugin` 标记（重复 apply 时先清旧的），并在 `ctx.effect` 里登记移除，插件卸载时自动清掉。

**不用 iframe。** iframe 拿不到宿主的主题 token、深浅色切换和 `ctx.locale`，装出来会像嵌了一块别人的页面。

## 模块契约

```ts
export interface ClubModule {
  id: string                    // 稳定 id，React key 与将来的存档前缀
  titleKey: string              // 文案 key，zh/en 都要有
  descriptionKey: string
  Component: ComponentType<{ t: Translate }>
}
```

面板（`views/Panel.tsx`）只做三件事：页头、按注册表顺序给每个模块套一个外框并渲染 `<Component t={t} />`、注册表为空时显示空状态。

模块是组件而不是渲染函数，是有意的：如果写成 `render(props)` 再在面板里直接调用，模块里的 hooks 会挂到面板组件上，模块增删或换序时状态就错乱了。

注册表是源码里的静态数组，模块是**编译进面板**的，不是运行时注册。加模块要改代码、重新构建。

## 数据与存档边界

- v0.1 不持久化任何东西。
- 将来单个模块的存档建议放 `localStorage`，key 用 `dsh-club:<模块 id>:<版本>`，读坏了就退回默认值。
- **不做**跨设备同步、联网排行榜、后端服务：这是一个纯前端插件，加后端就变成要运营的服务了。
- 面板是全局面板，槽位渲染时拿不到会话 props（`main` 是全局 keyed 槽位，owner props 为空）。真要读会话数据，得用宿主提供的 session 服务，或在会话作用域的槽位里另做，不是现在这条路径。

## 兼容性

`src/client/dsh.ts` 是对 DSH 客户端服务的最小手写类型声明，只覆盖当前调用面，没依赖 DSH 的类型包。

**没有异常不代表兼容。** 槽位参数改名、`t` 注入失效、注册被忽略，都可能不抛启动错误，只表现为面板白屏、显示原始 key 或入口不出现；槽位框架还会用 error boundary 吞掉渲染错误。所以升级 DSH 后要看的是：装上后入口在不在、面板渲不渲染、中英文对不对。`pnpm check` 里的产物冒烟检查能兜住 id / 导出 / 清单这类硬错误，兜不住运行时渲染。
