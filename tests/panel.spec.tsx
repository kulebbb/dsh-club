import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { zh } from '../src/client/locales.ts'
import { Panel } from '../src/client/views/Panel.tsx'
import type { ClubModule, Translate } from '../src/shared/types.ts'

const t: Translate = (key) => zh[key] ?? key

describe('娱乐中心面板', () => {
  it('没有模块时渲染空状态', () => {
    const html = renderToStaticMarkup(<Panel t={t} modules={[]} />)
    expect(html).toContain(zh['empty.title'])
    expect(html).toContain(zh['empty.desc'])
    expect(html).toContain('dsc-club-empty')
    expect(html).not.toContain('dsc-club-module"')
  })

  it('有模块时按顺序渲染分区标题、说明与主体', () => {
    const demo: ClubModule = {
      id: 'demo',
      titleKey: 'demo.title',
      descriptionKey: 'demo.desc',
      render: () => <span>demo-body</span>,
    }
    const dict: Record<string, string> = { 'demo.title': '示例模块', 'demo.desc': '一句说明' }
    const tr: Translate = (key) => dict[key] ?? zh[key] ?? key

    const html = renderToStaticMarkup(<Panel t={tr} modules={[demo]} />)
    expect(html).toContain('示例模块')
    expect(html).toContain('一句说明')
    expect(html).toContain('demo-body')
    expect(html).not.toContain('dsc-club-empty')
  })
})
