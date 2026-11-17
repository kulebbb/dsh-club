/**
 * 客户端半用到的 DSH 服务的最小结构声明。
 *
 * 照 DSH 插件社区的做法：只声明真正调用的方法，不把 DSH 的类型包拉成依赖。
 * 每个接口标了来源，升级 DSH 后按图核对：
 *   - `locale` / `slots`：client 基础服务（`@deepseek-ai/dsh-client-*`）；
 *   - `effect` / `inject`：Cordis 上下文能力。
 */

export type { Translate } from '../shared/types.ts'

/** 中央面板 id 的品牌类型：DSH 的 `MainPanelId` 不对外导出，这里只做编译期标记，防止与侧边栏 id 写岔。 */
declare const mainPanelIdBrand: unique symbol
export type MainPanelId = string & { readonly [mainPanelIdBrand]: true }

export interface LocaleService {
  register(namespace: string, dictionaries: { zh: Record<string, string>; en: Record<string, string> }): () => void
  bind(namespace: string): import('../shared/types.ts').Translate
}

export interface SlotsRegisterDefinition {
  name: string
  /** keyed 槽位（`main`）的身份；侧边栏入口用 `id`。 */
  key?: string
  id?: string
  order?: number
  locale?: string
  label?: () => string
  inject?: () => Record<string, unknown>
}

export interface SlotsService {
  inject(name: string, factory: () => unknown): unknown
  register(definition: SlotsRegisterDefinition, component: (props: any) => unknown): unknown
}

export interface ClientContext {
  locale: LocaleService
  slots: SlotsService
  effect(factory: () => (() => void) | void, label?: string): () => void
  inject(services: string[], callback: (scope: ClientContext) => void): void
}
