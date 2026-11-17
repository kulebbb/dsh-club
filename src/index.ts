/**
 * 宿主（Node 半）入口。
 *
 * 娱乐中心目前完全在浏览器半：宿主没有服务、路由或工具要注册。
 * 保留一个空的 `apply` 是为了让 bundle 里插入的那一行有可解析的插件导出；
 * 等真需要本地存档、或让 agent 参与（读战绩 / 下战书）时，宿主能力从这里长出来。
 */
export const name = '@kulebbb/dsh-club'

export function apply(): void {}
