import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

// 客户端半的模块 id 必须等于包名；这里从 package.json 读，避免两份手写常量漂移。
// 构建后 `scripts/check-bundle.mjs` 会再核对一遍产物里的 id。
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { name: string }

// 双入口：宿主半打 ESM，客户端半打浏览器 CJS 并按 DSH 客户端模块加载器的约定包一层。
// 约定：`window.__ModuleLoader__.load({ id, factory })`。
export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: 'esm',
    fixedExtension: false,
    platform: 'node',
    target: 'es2024',
    dts: true,
    clean: true,
  },
  {
    entry: { client: 'src/client/index.tsx' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    dts: false,
    clean: false,
    deps: { neverBundle: ['react', 'react/jsx-runtime'] },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
])
