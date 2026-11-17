# 安全说明

## 报告问题

发现安全问题请**不要**直接开公开 issue，用 GitHub 的私密报告：仓库页 → Security → Report a vulnerability。收到后会尽快确认。

## 设计上的边界

这个插件是纯前端的 DSH 面板。插件运行时（面板本身）：

- 不发网络请求，不加载远程脚本、字体或图片；
- 不使用 `eval`、`innerHTML`、`document.write`，也不读写 cookie；
- 不订阅会话事件，不读取会话内容，不往模型上下文里塞东西；
- 将来模块的本地存档只会写浏览器 `localStorage`，key 前缀 `dsh-club:`。

README 顶部的 CI / License 徽章是仓库页面资源（由 GitHub 与 shields.io 托管），不属于插件运行时。

如果某个改动打破上面任一条，应该在 PR 里说明理由。
