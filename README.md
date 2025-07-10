# 🎨 MDView - 终端中的 Markdown 渲染神器

<div align="center">

![MDView Demo](https://raw.githubusercontent.com/muxik/md-viewer/main/docs/images/demo.gif)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)

**一款很棒的终端 Markdown 渲染工具**

一个高性能、功能完整的 CLI 工具，让你在终端中享受 GitHub 风格的 Markdown 渲染体验。完美支持 AI 生成的长文本、代码块和表格内容。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用方法](#-使用方法) • [API 文档](#-api-文档) • [主题系统](#-主题系统)

</div>

## 🚀 为什么选择 MDView？

- **🎯 专为 AI 输出优化**: 完美处理 AI 生成的长文本、复杂表格和代码块
- **⚡ 高性能渲染**: 支持大文件快速渲染，无卡顿体验
- **🎨 精美显示**: GitHub 风格的终端渲染，支持语法高亮和表格对齐
- **🔧 开发者友好**: 既可作为 CLI 工具使用，也可作为 Node.js 模块集成
- **📱 自适应设计**: 自动适配终端宽度，完美支持中文和 Emoji

## ✨ 功能特性

### 🎨 渲染能力
- **完整 Markdown 语法**: 标题、段落、列表、引用、代码块、表格、链接等
- **代码语法高亮**: 基于 highlight.js，支持 180+ 编程语言
- **表格完美对齐**: 支持中文字符、Emoji，垂直边框完美对齐
- **One Dark 主题**: 流行的深色主题，护眼舒适

### 🚀 交互体验
- **智能分页**: 自动分页浏览，支持键盘导航
- **快捷键操作**: 类似 less/more 的直觉操作
- **管道支持**: 完美支持标准输入，配合其他命令使用
- **终端适配**: 自动检测终端宽度，响应式显示

### 🛠️ 开发集成
- **TypeScript 支持**: 完整的类型定义，开发体验极佳
- **模块化设计**: 可单独使用解析器、渲染器等组件
- **扩展性强**: 支持自定义主题和渲染器
- **零配置**: 开箱即用，无需复杂配置

## 📦 快速开始

### 全局安装

```bash
npm install -g @muxik/md-viewer
```

### 从源码构建

```bash
git clone https://github.com/muxik/md-viewer.git
cd md-viewer
npm install
npm run build
npm link  # 创建全局链接
```

### 基本使用

```bash
# 渲染 Markdown 文件
mdview README.md

# 从标准输入读取
echo "# Hello World" | mdview

# 使用不同主题
mdview --theme light README.md
```

## 🎯 使用方法

### 命令行界面

```bash
# 基本用法
mdview README.md

# 高级选项
mdview --theme onedark --width 100 --line-numbers README.md

# 禁用分页，直接输出
mdview --no-pager README.md

# 从管道读取（完美配合 AI 工具）
ai-tool generate | mdview
curl -s api.example.com/markdown | mdview
```

### 完整命令选项

```bash
Usage: mdview [options] [file]

Options:
  -t, --theme <theme>    选择主题 (onedark, dark, light)
  -w, --width <width>    设置输出宽度
  -l, --line-numbers     显示行号
  -n, --no-pager         禁用分页器
  --list-themes          列出可用主题
  -h, --help             显示帮助信息
  -v, --version          显示版本信息
```

### 快捷键操作

在分页模式下支持以下快捷键：

| 快捷键 | 功能 |
|--------|------|
| `↑/↓` | 逐行滚动 |
| `PgUp/PgDn` | 翻页 |
| `g` | 跳转到顶部 |
| `G` | 跳转到底部 |
| `q` / `Esc` | 退出 |
| `Ctrl+C` | 强制退出 |

## 📚 API 文档

### 作为 Node.js 模块使用

```javascript
import { Mdview } from '@muxik/md-viewer';

// 创建实例
const mdview = new Mdview({
  theme: 'onedark',
  width: 80,
  showLineNumbers: true,
  noPager: false
});

// 渲染文件
await mdview.renderFile('README.md');

// 渲染字符串内容
await mdview.renderContent('# Hello World\n\nThis is **markdown**.');

// 获取渲染结果（不直接输出）
const lines = await mdview.getRenderedLines('# Title\n\nContent here');
```

### 配置选项

```typescript
interface MdviewOptions {
  theme?: 'onedark' | 'dark' | 'light';  // 主题选择
  width?: number;                         // 输出宽度
  showLineNumbers?: boolean;              // 是否显示行号
  noPager?: boolean;                      // 是否禁用分页器
}
```

## 🎨 主题系统

### 内置主题

| 主题 | 描述 | 适用场景 |
|------|------|----------|
| `onedark` | One Dark 配色方案（默认） | 深色终端，护眼舒适 |
| `dark` | GitHub 深色主题 | 深色终端，经典风格 |
| `light` | GitHub 浅色主题 | 浅色终端，简洁明亮 |

### 主题预览

<div align="center">

![One Dark Theme](https://raw.githubusercontent.com/muxik/md-viewer/main/docs/images/theme-onedark.png)
<p><em>One Dark 主题（默认）</em></p>

![Light Theme](https://raw.githubusercontent.com/muxik/md-viewer/main/docs/images/theme-light.png)
<p><em>Light 主题</em></p>

</div>

```bash
# 查看所有可用主题
mdview --list-themes

# 测试不同主题效果
mdview --theme onedark sample.md
mdview --theme light sample.md
```

## 🔧 开发指南

### 项目结构

```
src/
├── parser/           # Markdown 解析器
│   ├── index.ts     # 主解析器
│   └── types.ts     # 类型定义
├── renderer/         # 终端渲染器
│   └── terminal-renderer.ts
├── pager/           # 分页器
│   └── index.ts
├── themes/          # 主题系统
│   ├── onedark.ts   # One Dark 主题
│   ├── dark.ts      # 深色主题
│   ├── light.ts     # 浅色主题
│   └── types.ts     # 主题类型
├── index.ts         # 主入口
└── cli.ts           # CLI 入口
```

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/muxik/md-viewer.git
cd md-viewer

# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码格式化
npm run format
```

### 技术栈

- **TypeScript** - 类型安全的开发体验
- **marked** - 高性能 Markdown 解析器
- **highlight.js** - 代码语法高亮引擎
- **chalk** - 终端颜色和样式
- **commander** - CLI 参数解析框架

## 🌟 使用场景

### 与 AI 工具配合

<div align="center">

![AI Integration](https://raw.githubusercontent.com/muxik/md-viewer/main/docs/images/ai-integration.png)
<p><em>与 AI 工具完美集成</em></p>

</div>

```bash
# 配合 ChatGPT CLI 使用
chatgpt "解释 React Hooks" | mdview

# 配合 GitHub Copilot CLI 使用
gh copilot suggest "优化这个函数" | mdview

# 查看 AI 生成的文档
ai-docs generate api.md | mdview
```

### 开发工作流

```bash
# 查看项目文档
mdview README.md

# 查看 API 文档
mdview docs/api.md

# 预览 Markdown 文件
mdview --theme light draft.md
```

### 系统集成

```bash
# 添加到 .bashrc 或 .zshrc
alias md='mdview'
alias readme='mdview README.md'

# 创建函数查看当前目录的 README
view_readme() {
  if [ -f "README.md" ]; then
    mdview README.md
  elif [ -f "readme.md" ]; then
    mdview readme.md
  else
    echo "No README file found"
  fi
}
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 本仓库
2. **创建**特性分支 (`git checkout -b feature/amazing-feature`)
3. **提交**更改 (`git commit -m 'Add amazing feature'`)
4. **推送**到分支 (`git push origin feature/amazing-feature`)
5. **开启** Pull Request

### 开发规范

- 遵循 TypeScript 最佳实践
- 添加适当的测试用例
- 更新相关文档
- 确保代码通过 ESLint 检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [marked](https://github.com/markedjs/marked) - 强大的 Markdown 解析器
- [highlight.js](https://github.com/highlightjs/highlight.js) - 语法高亮引擎
- [chalk](https://github.com/chalk/chalk) - 终端样式库
- [One Dark](https://github.com/atom/atom/tree/master/packages/one-dark-syntax) - 经典配色方案

## 🔗 相关链接

- [GitHub 仓库](https://github.com/muxik/md-viewer)
- [NPM 包](https://www.npmjs.com/package/@muxik/md-viewer)
- [问题反馈](https://github.com/muxik/md-viewer/issues)
- [更新日志](CHANGELOG.md)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star！**

Made with ❤️ for the terminal and AI community

</div>
