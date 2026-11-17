/**
 * 「娱乐中心」面板的样式（一整段 CSS 字符串）。
 *
 * 约定：
 * - 颜色 / 圆角 / 字号只用 DSH token（`--dsw-alias-*`、`--dsw-radius-*`、`--dsw-font-*`），
 *   深浅主题由宿主切换，这里不写 hex、不写 `[data-theme]`；
 *   页面顶部让开窗口控件用 `--dsh-frame-top-clearance`（内置页面同一写法）。
 * - 全部选择器带 `dsc-club-` 前缀，避免和 DSH 本体 / 其它插件撞名。
 * - 根容器自己滚动，页面居中留白，照宿主同类页面的节奏。
 */
export const CLUB_CSS = `
/* ---------- 根容器 ---------- */
.dsc-club-root{flex:1;min-height:0;overflow:auto;background:var(--dsw-alias-bg-base);
  color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14)}
.dsc-club-root *{box-sizing:border-box}
.dsc-club-page{max-width:880px;margin:0 auto;display:flex;flex-direction:column;gap:20px;
  padding:calc(28px + var(--dsh-frame-top-clearance,0px)) clamp(20px,4vw,40px) 64px}

/* ---------- 页头 ---------- */
.dsc-club-head{display:flex;flex-direction:column;gap:6px}
.dsc-club-title{margin:0;font:var(--dsw-font-l-20);color:var(--dsw-alias-label-primary)}
.dsc-club-sub{margin:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary)}

/* ---------- 空状态 ---------- */
.dsc-club-empty{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;
  padding:56px 24px;border:1px dashed var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);
  background:var(--dsw-alias-bg-layer-1)}
.dsc-club-empty .dsc-club-glyph{color:var(--dsw-alias-label-tertiary);opacity:.75}
.dsc-club-empty h2{margin:2px 0 0;font:var(--dsw-font-s-14);font-weight:600;color:var(--dsw-alias-label-primary)}
.dsc-club-empty p{margin:0;max-width:420px;font:var(--dsw-font-xs-13);line-height:1.65;
  color:var(--dsw-alias-label-secondary)}
.dsc-club-empty .dsc-club-hint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-caption);
  text-decoration:underline;text-underline-offset:2px;
  text-decoration-color:var(--dsw-alias-border-l2)}
.dsc-club-empty .dsc-club-hint:hover{color:var(--dsw-alias-label-secondary)}

/* ---------- 模块分区 ---------- */
.dsc-club-modules{display:flex;flex-direction:column;gap:16px}
.dsc-club-module{display:flex;flex-direction:column;gap:12px;padding:18px 20px;
  border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-md);
  background:var(--dsw-alias-bg-layer-1)}
.dsc-club-module-head{display:flex;flex-direction:column;gap:4px}
.dsc-club-module-head h2{margin:0;font:var(--dsw-font-s-14);font-weight:600;color:var(--dsw-alias-label-primary)}
.dsc-club-module-desc{margin:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary)}
.dsc-club-module-body{min-width:0}
`
