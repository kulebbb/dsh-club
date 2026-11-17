/**
 * 面板文案（locale 命名空间 `dshClub`）。
 *
 * `index.tsx` 在 apply 里 `ctx.locale.register(NS, { zh, en })`；
 * 槽位的 `locale: NS` 让宿主把 `t` 注入组件 props。key 是扁平字符串。
 */

/** locale 命名空间，与 `ctx.locale.register(NS, ...)`、槽位 `locale` 保持一致。 */
export const NS = 'dshClub'

/** 简体中文字典；也是 key 集合的单一真相源。 */
export const zh: Record<string, string> = {
  title: '娱乐中心',
  subtitle: '等 agent 干活的空隙，来这儿坐一会儿。',

  'empty.title': '还没开张',
  'empty.desc': '内容方向还没定：小游戏、摸鱼电台、让 agent 陪你玩一局，都可以往这儿放。',
  'empty.hint': '想加点什么，来仓库提个 issue。',
}

/** 英文字典；key 必须与 `zh` 完全一致。 */
export const en: Record<string, string> = {
  title: 'Club',
  subtitle: 'A corner to sit in while the agent works.',

  'empty.title': 'Not open yet',
  'empty.desc': 'Content is still undecided — arcade games, a lo-fi radio, or a round with the agent all fit here.',
  'empty.hint': 'Ideas are welcome in the issue tracker.',
}
