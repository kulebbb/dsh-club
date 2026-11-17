/**
 * 娱乐模块注册表。
 *
 * 现在是空数组：内容方向还没定，面板会渲染「还没开张」的空状态。
 * 想加模块（小游戏 / 电台 / 陪玩 …）照 `docs/modules.md` 写一个 `ClubModule`，push 进这里即可。
 */
import type { ClubModule } from '../shared/types.ts'

export const MODULES: readonly ClubModule[] = []
