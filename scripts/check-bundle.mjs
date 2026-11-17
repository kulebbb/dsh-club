#!/usr/bin/env node
/**
 * 构建产物冒烟检查（在 `pnpm build` 之后跑，已接进 `pnpm check`）。
 *
 * 验证三件事，防止 tsdown 升级或包名改动后「构建成功但装上不生效」：
 *   1. lib/client.js 能被 DSH 的客户端加载器吃下：id 等于包名、导出 apply 与 inject；
 *   2. lib/index.js 能被 Node 导入：导出 apply，name 等于包名；
 *   3. package.json 的 exports / files / icon / patch 指向的东西真实存在。
 */
import { readFileSync, statSync } from 'node:fs'
import vm from 'node:vm'

const root = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const exists = (path) => {
  try {
    return statSync(new URL(path, root)).isFile()
  } catch {
    return false
  }
}

const pkg = JSON.parse(read('package.json'))
const problems = []
const fail = (message) => problems.push(message)

// ---------- 1) 客户端半 ----------
let entry
const sandbox = { window: { __ModuleLoader__: { load: (value) => { entry = value } } }, console }
vm.runInNewContext(read('lib/client.js'), sandbox, { filename: 'lib/client.js' })

if (!entry) {
  fail('lib/client.js 没有调用 window.__ModuleLoader__.load')
} else {
  if (entry.id !== pkg.name) fail(`客户端模块 id「${entry.id}」与包名「${pkg.name}」不一致`)

  // 只放行插件声明外置的两个 react 入口；别的 require 都算漏打进产物的依赖。
  const jsxRuntime = { Fragment: Symbol('Fragment'), jsx: () => null, jsxs: () => null, jsxDEV: () => null }
  const reactStub = new Proxy({}, { get: () => () => null })
  const exported = entry.factory((name) => {
    if (name === 'react/jsx-runtime') return jsxRuntime
    if (name === 'react') return reactStub
    throw new Error(`客户端半 require 了未声明的依赖：${name}`)
  })

  if (typeof exported.apply !== 'function') fail('客户端半没有导出 apply')
  for (const service of ['slots', 'locale']) {
    if (!exported.inject?.includes(service)) fail(`客户端半的 inject 里缺少 ${service}`)
  }
}

// ---------- 2) 宿主半 ----------
const host = await import(new URL('lib/index.js', root))
if (typeof host.apply !== 'function') fail('宿主半没有导出 apply')
if (host.name !== pkg.name) fail(`宿主半 name「${host.name}」与包名「${pkg.name}」不一致`)

// ---------- 3) 清单 ----------
for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
  const targets = typeof target === 'string' ? [target] : Object.values(target)
  for (const file of targets) {
    if (file.includes('*') || file.endsWith('package.json')) continue
    if (!exists(file)) fail(`exports.${subpath} 指向的文件不存在：${file}`)
  }
}

for (const required of ['lib', 'locale/*.json', 'icon.svg', 'cordis.patch.yml', 'docs']) {
  if (!pkg.files?.includes(required)) fail(`package.json 的 files 里缺少 ${required}`)
}

const iconPath = pkg.icon ?? './icon.svg'
if (!exists(iconPath)) {
  fail(`图标不存在：${iconPath}`)
} else if (statSync(new URL(iconPath, root)).size > 256 * 1024) {
  fail(`图标超过 256 KiB：${iconPath}`)
}

const patchPath = pkg.dsh?.bundle?.patch
if (!patchPath) {
  fail('package.json 没有声明 dsh.bundle.patch')
} else if (!exists(patchPath)) {
  fail(`bundle patch 不存在：${patchPath}`)
} else if (!read(patchPath).includes(`name: '${pkg.name}'`)) {
  fail(`bundle patch 里没有插入 ${pkg.name}`)
}

// ---------- 结果 ----------
if (problems.length > 0) {
  console.error('构建产物冒烟检查未通过：')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`构建产物冒烟检查通过：${pkg.name}@${pkg.version}`)
