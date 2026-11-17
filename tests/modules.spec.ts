import { describe, expect, it } from 'vitest'
import { MODULES } from '../src/client/modules.ts'
import { en, zh } from '../src/client/locales.ts'

/**
 * 模块注册表的硬门槛。
 *
 * 现在注册表是空的，这些断言只在加模块后才真正生效——目的就是让「加了模块但漏文案」
 * 在 CI 里挂掉，而不是等用户在面板里看到 `module.xxx.title` 这种原始 key。
 * 注意只覆盖契约里声明的 titleKey / descriptionKey；组件内部自己的文案 key 由渲染测试盯。
 */
describe('模块注册表', () => {
  it('模块 id 不重复', () => {
    const ids = MODULES.map((mod) => mod.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每个模块的标题与说明在中英字典里都有非空文案', () => {
    for (const mod of MODULES) {
      for (const key of [mod.titleKey, mod.descriptionKey]) {
        expect(zh[key]?.trim(), `zh.${key}（模块 ${mod.id}）`).toBeTruthy()
        expect(en[key]?.trim(), `en.${key}（模块 ${mod.id}）`).toBeTruthy()
      }
    }
  })

  it('每个模块都填了主体组件', () => {
    // 只判断有没有填。类型层面已保证是可当组件渲染的 ComponentType，
    // memo / forwardRef 这类 exotic component 的 typeof 是 object，不能拿它当判据。
    for (const mod of MODULES) {
      expect(mod.Component, `模块 ${mod.id} 的 Component`).toBeTruthy()
    }
  })
})
