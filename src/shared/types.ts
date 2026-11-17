/**
 * 模块契约：面板与具体玩法之间的边界。
 *
 * 面板只负责外框、标题和留白；每个模块是一个 React 组件，自己管状态与布局。
 * 这样以后加小游戏、电台、陪玩都不用碰面板代码，也不会有两个模块抢同一块布局。
 */
import type { ComponentType } from 'react'

/** 文案翻译函数：key 取自 `src/client/locales.ts` 的字典，`{name}` 由第二个参数插值。 */
export type Translate = (key: string, vars?: Record<string, string | number>) => string

/**
 * 一个娱乐模块。
 *
 * 当前注册表（`src/client/modules.ts`）是空的：内容方向待定。
 * 加模块的步骤见 `docs/modules.md`，`tests/modules.spec.ts` 会校验文案 key 与 id。
 */
export interface ClubModule {
  /** 稳定 id，用作 React key，也是将来本地存档的前缀。 */
  id: string
  /** 模块名文案 key，必须同时出现在 zh / en 字典里。 */
  titleKey: string
  /** 一句说明文案 key，同上。 */
  descriptionKey: string
  /**
   * 模块主体组件。面板渲染 `<Component t={t} />`，hooks 归组件自己。
   *
   * 别写成 `render: (props) => ...` 再在面板里直接调用：那样模块的 hooks 会挂到
   * 面板组件上，模块增删或换序时状态错乱。
   */
  Component: ComponentType<{ t: Translate }>
}
