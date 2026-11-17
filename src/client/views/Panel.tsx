/**
 * 「娱乐中心」中央面板。
 *
 * 面板本身只是容器：有模块就按注册表顺序分区渲染，没有模块就显示「还没开张」的空状态。
 * 具体玩法、状态与动画都归模块自己，面板不订阅任何宿主事件。
 */
import type { ClubModule, Translate } from '../../shared/types.ts'
import { JoystickGlyph } from '../icons.tsx'
import { MODULES } from '../modules.ts'

export interface PanelProps {
  /** 宿主按槽位 `locale` 注入的翻译函数。 */
  t: Translate
  /** 模块列表；不传就用注册表。测试里用它注入样例模块。 */
  modules?: readonly ClubModule[]
}

export function Panel(props: PanelProps): JSX.Element {
  const { t } = props
  const modules = props.modules ?? MODULES

  return (
    <div className="dsc-club-root">
      <div className="dsc-club-page">
        <header className="dsc-club-head">
          <h1 className="dsc-club-title">{t('title')}</h1>
          <p className="dsc-club-sub">{t('subtitle')}</p>
        </header>

        {modules.length === 0 ? (
          <div className="dsc-club-empty">
            <JoystickGlyph />
            <h2>{t('empty.title')}</h2>
            <p>{t('empty.desc')}</p>
            <p className="dsc-club-hint">{t('empty.hint')}</p>
          </div>
        ) : (
          <div className="dsc-club-modules">
            {modules.map((mod) => (
              <section className="dsc-club-module" key={mod.id}>
                <header className="dsc-club-module-head">
                  <h2>{t(mod.titleKey)}</h2>
                  <p className="dsc-club-module-desc">{t(mod.descriptionKey)}</p>
                </header>
                <div className="dsc-club-module-body">{mod.render({ t })}</div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
