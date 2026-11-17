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
- `inject` 缺任何一个服务（`slots`、`locale`）就不注册，所以插件在精简组合里只是不出现，不报错。

样式用一段 CSS 字符串在 `apply` 里插到 `<head>`，带 `data-plugin` 标记，并在 `ctx.effect` 里登记移除，插件卸载时自动清掉。

**不用 iframe。** iframe 拿不到宿主的主题 token、深浅色切换和 `ctx.locale`，装出来会像嵌了一块别人的页面。

## 模块契约

```ts
export interface ClubModule {
  id: string                    // 稳定 id，React key 与存档前缀
  titleKey: string              // 文案 key，zh/en 都要有
  descriptionKey: string
  render: (props: { t: Translate }) => ReactNode
}
```

面板（`views/Panel.tsx`）只做三件事：页头、按注册表顺序给每个模块套一个外框、注册表为空时显示空状态。模块的主体 UI 完全归模块自己，所以加玩法不用改面板代码。

## 数据与存档边界

- v0.1 不持久化任何东西。
- 将来单个模块的存档建议放 `localStorage`，key 用 `dsh-club:<模块 id>:<版本>`，读坏了就退回默认值。
- **不做**跨设备同步、联网排行榜、后端服务：这是一个纯前端插件，加后端就变成要运营的服务了。
- 会话数据（token 数、连续开工天数之类）目前不读；真要读，走槽位 props 而不是自己订阅 session 事件。

## 兼容性

`src/client/dsh.ts` 是对 DSH 客户端服务的最小手写类型声明，没依赖 DSH 的类型包。DSH 升级后如果没有启动异常，说明这些方法签名还兼容；面板白屏或入口不出现时，先核对这里的 `slots.register` / `locale.bind` 签名。
