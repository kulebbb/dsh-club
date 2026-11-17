#!/usr/bin/env node
/**
 * 构建产物冒烟检查（在 `pnpm build` 之后跑，已接进 `pnpm check`）。
 *
 * 只验证「能被加载、导出对、该打的包都在」，不执行 apply()——apply 需要真实的 DOM 与
 * 宿主服务。挡的是 tsdown 升级、改名、清单改动后「构建成功但装上不生效」这类回归：
 *   1. lib/client.js 能被 DSH 的客户端加载器吃下：id 等于包名、导出 apply 与 inject；
 *   2. lib/index.js 能被 Node 导入：导出 apply，name 等于包名；
 *   3. manifest 该有的 subpath、dsh.client、dsh.bundle 都在，patch 真插入了这个包；
 *   4. npm pack 打出来的文件里确实有运行时产物。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { parse as parseYaml } from 'yaml'

const root = new URL('../', import.meta.url)
const rootDir = fileURLToPath(root)
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
try {
  vm.runInNewContext(read('lib/client.js'), sandbox, { filename: 'lib/client.js' })
} catch (error) {
  fail(`lib/client.js 执行失败：${error.message}`)
}

if (!entry) {
  fail('lib/client.js 没有调用 window.__ModuleLoader__.load')
} else {
  if (entry.id !== pkg.name) fail(`客户端模块 id「${entry.id}」与包名「${pkg.name}」不一致`)
  if (typeof entry.factory !== 'function') fail('__ModuleLoader__.load 的入参里没有 factory 函数')
}

if (entry && typeof entry.factory === 'function') {
  // 允许列表：插件声明外置的 react 两个入口，加上 dsh.client.external 里自己声明的。
  const jsxRuntime = { Fragment: Symbol('Fragment'), jsx: () => null, jsxs: () => null, jsxDEV: () => null }
  const stubs = new Map([
    ['react', new Proxy({}, { get: () => () => null })],
    ['react/jsx-runtime', jsxRuntime],
  ])
  for (const name of pkg.dsh?.client?.external ?? []) {
    if (!stubs.has(name)) stubs.set(name, new Proxy({}, { get: () => () => null }))
  }

  let exported
  try {
    exported = entry.factory((name) => {
      const stub = stubs.get(name)
      if (stub) return stub
      throw new Error(`客户端半 require 了未声明的依赖：${name}`)
    })
  } catch (error) {
    fail(`客户端模块工厂执行失败：${error.message}`)
  }

  if (exported) {
    if (typeof exported.apply !== 'function') fail('客户端半没有导出 apply')
    for (const service of ['slots', 'locale']) {
      if (!exported.inject?.includes(service)) fail(`客户端半的 inject 里缺少 ${service}`)
    }
  }
}

// ---------- 2) 宿主半 ----------
try {
  const host = await import(new URL('lib/index.js', root))
  if (typeof host.apply !== 'function') fail('宿主半没有导出 apply')
  if (host.name !== pkg.name) fail(`宿主半 name「${host.name}」与包名「${pkg.name}」不一致`)
} catch (error) {
  fail(`lib/index.js 导入失败：${error.message}`)
}

// ---------- 3) manifest ----------
const exportsMap = pkg.exports ?? {}
for (const subpath of ['.', './client', './locale/*.json', './icon', './package.json']) {
  if (!(subpath in exportsMap)) fail(`package.json 的 exports 缺少 ${subpath}`)
}

for (const [subpath, target] of Object.entries(exportsMap)) {
  const targets = typeof target === 'string' ? [target] : Object.values(target)
  for (const file of targets) {
    if (file.includes('*') || file.endsWith('package.json')) continue
    if (!exists(file)) fail(`exports.${subpath} 指向的文件不存在：${file}`)
  }
}

if (pkg.dsh?.client?.platform !== 'web') {
  fail('package.json 的 dsh.client.platform 不是 "web"，宿主不会加载浏览器半')
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
} else {
  try {
    const layers = parseYaml(read(patchPath))
    const rows = Array.isArray(layers) ? layers.flatMap((layer) => layer?.insert ?? []) : []
    const row = rows.find((item) => item?.name === pkg.name)
    if (!row) fail(`bundle patch 里没有插入 ${pkg.name} 这一行`)
    else if (!row.id) fail(`bundle patch 里 ${pkg.name} 这一行没有 id`)
  } catch (error) {
    fail(`bundle patch 不是合法 YAML：${error.message}`)
  }
}

// ---------- 4) 实际打包内容 ----------
try {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: rootDir, encoding: 'utf8' }),
  )
  const files = new Set((packed[0]?.files ?? []).map((file) => file.path))
  for (const required of ['package.json', 'lib/index.js', 'lib/client.js', 'cordis.patch.yml', 'icon.svg']) {
    if (!files.has(required)) fail(`npm pack 的内容里缺少 ${required}`)
  }
} catch (error) {
  fail(`npm pack 检查失败：${error.message}`)
}

// ---------- 结果 ----------
if (problems.length > 0) {
  console.error('构建产物冒烟检查未通过：')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`构建产物冒烟检查通过：${pkg.name}@${pkg.version}`)
