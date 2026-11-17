/**
 * 模块契约：面板与具体玩法之间的边界。
 *
 * 面板只负责外框、标题和留白；每个模块自己渲染主体。这样以后加小游戏、电台、
 * 陪玩都不用碰面板代码，也不会有两个模块抢同一块布局。
 */
import type { ReactNode } from 'react'

/** 文案翻译函数：key 取自 `src/client/locales.ts` 的字典，`{name}` 由第二个参数插值。 */
export type Translate = (key: string, vars?: Record<string, string | number>) => string

/**
 * 一个娱乐模块。
 *
 * 当前注册表（`src/client/modules.ts`）是空的：内容方向待定。
 * 加模块的步骤见 `docs/modules.md`。
 */
export interface ClubModule {
  /** 稳定 id，用作 React key，也是将来本地存档的前缀。 */
  id: string
  /** 模块名文案 key，必须同时出现在 zh / en 字典里（`tests/locales.spec.ts` 会校验）。 */
  titleKey: string
  /** 一句说明文案 key，同上。 */
  descriptionKey: string
  /** 模块主体。整个模块的 UI 归它自己管，面板不介入。 */
  render: (props: { t: Translate }) => ReactNode
}
