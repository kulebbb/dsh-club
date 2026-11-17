import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { NS, en, zh } from '../src/client/locales.ts'

/** 插件在 Plugin Manager 里的展示元数据：两个 locale 都要有 title 和 description。 */
function readMeta(locale: 'zh' | 'en'): { title: string; description: string } {
  const raw = readFileSync(new URL(`../locale/${locale}.json`, import.meta.url), 'utf8')
  const parsed = JSON.parse(raw) as { meta?: { title?: string; description?: string } }
  return { title: parsed.meta?.title ?? '', description: parsed.meta?.description ?? '' }
}

describe('面板文案', () => {
  it('中英文字典的 key 集合完全一致', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(zh).sort())
  })

  it('命名空间与槽位注册用的一致', () => {
    expect(NS).toBe('dshClub')
  })

  it('没有空文案或漏翻译', () => {
    for (const [key, value] of Object.entries(zh)) {
      expect(value.trim(), `zh.${key}`).not.toBe('')
      expect(en[key]?.trim(), `en.${key}`).not.toBe('')
    }
  })

  it('插件展示元数据中英文齐全', () => {
    for (const locale of ['zh', 'en'] as const) {
      const meta = readMeta(locale)
      expect(meta.title.trim(), `${locale} meta.title`).not.toBe('')
      expect(meta.description.trim(), `${locale} meta.description`).not.toBe('')
    }
  })
})
