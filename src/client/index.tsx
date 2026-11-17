/**
 * 客户端（浏览器半）入口：侧边栏「娱乐中心」图标 + 中央面板。
 *
 * 接线照 DSH 内置「插件」「自动化任务」的同一套槽位：
 *   - `sidebar.panellist`（list 槽位）：`order: 30`，排在插件(0)、自动化任务(10)、Skill 管理(20) 之后；
 *   - `main`（keyed 槽位）：`key` 必须等于侧边栏入口的 `id`，点击侧边栏才切得过来。
 *
 * 两层依赖门禁，代价是一次空转、换来缺服务时不会半初始化：
 *   - 导出的 `inject` 让整个客户端插件只在 slots / locale 齐备时激活；
 *   - 里面再 `ctx.inject` 一次，槽位或文案服务缺失时整块跳过，不留死入口。
 */
import type { ClientContext, MainPanelId } from './dsh.ts'
import { SidebarPanelIcon } from './icons.tsx'
import { NS, en, zh } from './locales.ts'
import { CLUB_CSS } from './styles.ts'
import { Panel } from './views/Panel.tsx'

/** 中央面板 id，同时是侧边栏入口 id 与 main 槽位 key，三者必须一致。 */
export const PANEL_ID = 'club' as MainPanelId

/** 硬依赖：槽位（注册入口）与文案（面板标题）。 */
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-club: dictionaries')

  if (typeof document !== 'undefined') {
    // 重复 apply（HMR、插件重载）会再插一份，先清掉旧的。
    document.querySelector('style[data-plugin="@kulebbb/dsh-club"]')?.remove()
    const style = document.createElement('style')
    style.setAttribute('data-plugin', '@kulebbb/dsh-club')
    style.textContent = CLUB_CSS
    document.head.append(style)
    ctx.effect(() => () => style.remove(), 'dsh-club: styles')
  }

  ctx.inject(inject, (scope) => {
    const t = scope.locale.bind(NS)

    scope.effect(() => {
      scope.slots.inject('sidebar.panellist', () =>
        scope.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 30,
            locale: NS,
            label: () => t('title'),
          },
          SidebarPanelIcon,
        ),
      )
    }, 'dsh-club: sidebar entry')

    scope.effect(() => {
      scope.slots.inject('main', () =>
        scope.slots.register(
          {
            name: 'main',
            key: PANEL_ID,
            locale: NS,
          },
          Panel,
        ),
      )
    }, 'dsh-club: main panel')
  })
}
