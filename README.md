# yacu: Yet another CC98 userscript

又一个 CC98 增强脚本

<https://greasyfork.org/zh-CN/scripts/438399>

## What problem does it solve? How?

集思广益版有许多前辈提出了有意思的需求，或广泛或小众。由于种种因素所限，可能站务组决定不予采纳，或者技术组选择暂不实现。这个脚本期望作为第三方，为喜欢折腾的用户提供一种~~折腾~~自定义的体验。

在实现上，传统的用户脚本大多基于对页面元素的直接操作，对单页面应用则需配合 setTimeout / setInterval 以等待完全加载和应对翻页情况。近年来前端技术发展迅速，为开发提供了便利，因此项目设计时完全放弃了旧浏览器的兼容性以及用户脚本管理器提供的 API，选择实践现代浏览器提供的新的原生特性（另一方面也是为了锻炼自己去学习更多新知识）。

- 模块化开发、工程化开发，拓展方便。（Rollup+esbuild+TypeScript+Babel+Svelte+Tailwind）
- ES6 Proxy 拦截 Fetch、History 等，实现精准操作。

## 功能

- 每个楼层的风评操作统计
- 屏蔽用户（新帖列表的主题帖、主题帖下的回复帖）
- ...
