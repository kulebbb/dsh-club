/**
 * 侧边栏入口图标与空状态插画。
 *
 * 全部用 `currentColor`，颜色由使用处的主题 token 决定，这里不写死色值。
 */

/**
 * 侧边栏入口：DSH 会传 `size`（收起 16 / 展开 18）与 `active`。
 * 当前图标不需要区分选中态，`active` 只留在签名里免得宿主传参报错。
 */
export function SidebarPanelIcon(props: { size?: number; active?: boolean }): JSX.Element {
  const size = props.size ?? 16
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="4.4" r="2.1" />
      <path d="M8 6.5v4.4" />
      <path d="M3.6 12.2h8.8" strokeWidth="2.8" />
    </svg>
  )
}

/** 空状态里的大号摇杆：纯装饰，`aria-hidden`，大小由调用处给。 */
export function JoystickGlyph(props: { size?: number }): JSX.Element {
  const size = props.size ?? 44
  return (
    <svg
      className="dsc-club-glyph"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="18" cy="9.4" r="3.9" />
      <path d="M17 12.6h2v9.2h-2z" />
      <rect x="8.4" y="21.8" width="19.2" height="5.2" rx="2.6" />
    </svg>
  )
}
