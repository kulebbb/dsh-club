# 加一个娱乐模块

面板是容器，玩法都做成模块。加一个模块大约四步：写组件、加文案、进注册表、补测试。

## 契约

```ts
// src/shared/types.ts
export interface ClubModule {
  id: string
  titleKey: string
  descriptionKey: string
  Component: ComponentType<{ t: Translate }>
}
```

约束：

- `id` 一经发布就别改——将来它是本地存档的 key 前缀。
- `titleKey` / `descriptionKey` 必须在 `src/client/locales.ts` 的 `zh` 和 `en` 里同时存在，`tests/modules.spec.ts` 会校验。
- `Component` 是组件，`t` 由面板传进来。模块自己的 UI 文案也一律走 `t`，不要在组件里写死中文或英文。
- 外框、标题、说明由面板画，模块里别再套一层卡片。

## 步骤

**1. 写组件。** 放在 `src/client/modules/<id>.tsx`，组件自己管状态：

```tsx
// src/client/modules/example.tsx
import { useState } from 'react'
import type { ClubModule, Translate } from '../../shared/types.ts'

function ExampleView({ t }: { t: Translate }) {
  const [round, setRound] = useState(0)
  return (
    <div className="dsc-club-example">
      <button type="button" onClick={() => setRound((n) => n + 1)}>
        {round === 0 ? t('module.example.start') : t('module.example.round', { n: round })}
      </button>
    </div>
  )
}

export const example: ClubModule = {
  id: 'example',
  titleKey: 'module.example.title',
  descriptionKey: 'module.example.desc',
  Component: ExampleView,
}
```

**2. 加文案。** `src/client/locales.ts` 里中英各加一份，key 必须成对：

```ts
// zh
'module.example.title': '示例玩法',
'module.example.desc': '一句话说清这模块是什么。',
'module.example.start': '开始',
'module.example.round': '第 {n} 局',
// en
'module.example.title': 'Example',
'module.example.desc': 'One sentence about what this module is.',
'module.example.start': 'Start',
'module.example.round': 'Round {n}',
```

**3. 进注册表。** `src/client/modules.ts`：

```ts
import { example } from './modules/example.tsx'

export const MODULES: readonly ClubModule[] = [example]
```

**4. 补测试。** 在 `tests/` 下加一条渲染测试，照 `tests/panel.spec.tsx` 的写法把模块传进 `<Panel modules={[example]} />`，断言组件真的渲染出来了。文案是否齐全、id 是否重复，`tests/modules.spec.ts` 会自动覆盖。

## 样式

- 类名带 `dsc-club-` 前缀。样式可以追加到 `src/client/styles.ts` 的 `CLUB_CSS`，也可以在组件里内联 `<style>`（组件卸载时一起消失）；仓库没有 CSS 文件的构建管线，别 `import './x.css'`。
- 颜色/字号/圆角只用 `--dsw-*` token，写死颜色就不跟深浅色。
- 尺寸、间距照宿主同类页面抄，别自创一套节奏。

## 存档

需要存东西（最高分、进度）时：

```ts
const KEY = 'dsh-club:example:v1'
function load(): number {
  try {
    const raw = localStorage.getItem(KEY)
    return raw === null ? 0 : Number(raw) || 0
  } catch {
    return 0
  }
}
```

约定：key 用 `dsh-club:<模块 id>:<版本>`；读失败一律退回默认值，不弹错；换数据结构时升版本号，旧 key 不用删。

## 资源与版权

音效、图形自己用代码生成或自己画。不要引入来源不明的素材、字体或第三方 UI 库——仓库是 MIT 开源的，素材得能跟着一起分发。

## 自查

- [ ] `pnpm check` 过
- [ ] 在 DSH 里点开面板看过
- [ ] 深浅主题都试过
- [ ] 中英文都显示正常
- [ ] 没有网络请求，没有订阅会话事件
