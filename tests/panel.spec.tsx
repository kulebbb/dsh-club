import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { zh } from '../src/client/locales.ts'
import { MODULES } from '../src/client/modules.ts'
import { Panel } from '../src/client/views/Panel.tsx'
import type { ClubModule, Translate } from '../src/shared/types.ts'

const t: Translate = (key) => zh[key] ?? key

const dict: Record<string, string> = { 'demo.title': '示例模块', 'demo.desc': '一句说明' }
const tr: Translate = (key) => dict[key] ?? zh[key] ?? key

/** 样例模块：主体把拿到的 `t` 和 marker 一起渲染出来，方便断言。 */
function demoModule(id: string, marker: string): ClubModule {
  return {
    id,
    titleKey: 'demo.title',
    descriptionKey: 'demo.desc',
    Component: ({ t: translate }) => (
      <span>
        {marker}:{translate('demo.title')}
      </span>
    ),
  }
}

describe('娱乐中心面板', () => {
  it('注册表为空时渲染空状态', () => {
    expect(MODULES).toHaveLength(0)
    const html = renderToStaticMarkup(<Panel t={t} />)
    expect(html).toContain(zh['empty.title'])
    expect(html).toContain(zh['empty.desc'])
    expect(html).toContain('dsc-club-empty')
    expect(html).not.toContain('class="dsc-club-modules"')
  })

  it('模块按注册表顺序渲染，组件拿到的是同一个 t', () => {
    const modules = [demoModule('first', 'first-body'), demoModule('second', 'second-body')]
    const html = renderToStaticMarkup(<Panel t={tr} modules={modules} />)

    expect(html).not.toContain('dsc-club-empty')
    expect(html.match(/class="dsc-club-module"/g)).toHaveLength(2)

    const first = html.indexOf('first-body')
    const second = html.indexOf('second-body')
    expect(first).toBeGreaterThan(-1)
    expect(second).toBeGreaterThan(first)
    // 模块拿到的 t 生效了：标题与主体都渲染出中文，而不是原始 key
    expect(html).toContain('示例模块')
    expect(html).not.toContain('demo.title')
  })
})
