# 加一个娱乐模块

面板是容器，玩法都做成模块。加一个模块大约四步：写 view、加文案、进注册表、补测试。

## 契约

```ts
// src/shared/types.ts
export interface ClubModule {
  id: string
  titleKey: string
  descriptionKey: string
  render: (props: { t: Translate }) => ReactNode
}
```

约束：

- `id` 一经发布就别改——将来它是本地存档的 key 前缀。
- `titleKey` / `descriptionKey` 必须在 `src/client/locales.ts` 的 `zh` 和 `en` 里同时存在，否则测试挂。
- `render` 返回模块主体；外框、标题、说明由面板画，别自己再套一层卡片。

## 步骤

**1. 写 view。** 放在 `src/client/modules/<id>.tsx`，组件自己管状态：

```tsx
// src/client/modules/example.tsx
import { useState } from 'react'
import type { ClubModule } from '../../shared/types.ts'

function ExampleView() {
  const [round, setRound] = useState(0)
  return (
    <div className="dsc-club-example">
      <button type="button" onClick={() => setRound((n) => n + 1)}>
        {round === 0 ? '开始' : `第 ${round} 局`}
      </button>
    </div>
  )
}

export const example: ClubModule = {
  id: 'example',
  titleKey: 'module.example.title',
  descriptionKey: 'module.example.desc',
  render: () => <ExampleView />,
}
```

**2. 加文案。** `src/client/locales.ts` 里中英各加一条：

```ts
// zh
'module.example.title': '示例玩法',
'module.example.desc': '一句话说清这模块是什么。'
// en
'module.example.title': 'Example',
'module.example.desc': 'One sentence about what this module is.'
```

**3. 进注册表。** `src/client/modules.ts`：

```ts
import { example } from './modules/example.tsx'

export const MODULES: readonly ClubModule[] = [example]
```

**4. 补测试。** 在 `tests/` 下加一条渲染测试，照 `tests/panel.spec.tsx` 的写法把模块传进 `<Panel modules={[example]} />`，断言它真渲染出来了。

## 样式

- 类名带 `dsc-club-` 前缀，写在 `src/client/styles.ts`；模块自己的样式也可以放模块文件里，但同样只用 token。
- 只用 `--dsw-*` 主题 token；颜色写死就不跟深浅色。
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
