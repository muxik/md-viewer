# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-10

### Added
- 🎉 **Initial Release** - MDView 终端 Markdown 渲染器
- 📝 **完整 Markdown 语法支持**
  - 标题 (H1-H6)
  - 段落和文本格式化（粗体、斜体、删除线）
  - 有序和无序列表（支持嵌套）
  - 引用块（支持多级嵌套）
  - 代码块和行内代码
  - 表格（完美对齐，支持中文字符）
  - 链接和图片（显示为链接形式）
  - 水平分割线
  - HTML 内容渲染

- 🎨 **代码语法高亮**
  - 基于 highlight.js
  - 支持 180+ 编程语言
  - 自动语言检测

- 🌈 **主题系统**
  - One Dark 主题（默认）- 流行的深色配色
  - Dark 主题 - GitHub 深色风格
  - Light 主题 - GitHub 浅色风格

- 📖 **智能分页器**
  - 自动分页显示
  - 键盘导航支持（↑/↓, PgUp/PgDn, g/G, q/Esc）
  - 可选禁用分页模式

- 🔧 **CLI 工具**
  - 全局安装支持：`npm install -g @muxik/md-viewer`
  - 丰富的命令行选项
  - 标准输入支持（管道操作）
  - 主题选择和自定义宽度
  - 行号显示选项

- 🛠️ **开发者 API**
  - TypeScript 支持
  - 模块化设计
  - 可作为 Node.js 模块使用
  - 完整的类型定义

- 🌍 **国际化支持**
  - 完美支持中文字符显示
  - Emoji 渲染支持
  - Unicode 字符宽度正确计算

- ⚡ **性能优化**
  - 针对 AI 输出内容优化
  - 大文件快速渲染
  - 内存高效处理
  - 响应式终端宽度适配

### Features Detail

#### 🎯 专为 AI 输出优化
- 处理 AI 生成的长文本内容
- 完美支持复杂表格结构
- 多级引用渲染（支持无限嵌套）
- 代码块语法高亮

#### 📱 终端适配
- 自动检测终端宽度
- 响应式布局
- 表格垂直边框完美对齐
- 中文字符宽度正确处理

#### 🔗 集成友好
- 支持与 ChatGPT CLI、GitHub Copilot 等 AI 工具配合
- 管道操作完美支持
- Shell 集成便利

### Technical Implementation
- **Language**: TypeScript
- **Dependencies**: 
  - marked (Markdown 解析)
  - highlight.js (语法高亮)
  - chalk (终端颜色)
  - commander (CLI 参数解析)
  - cli-table3 (表格渲染)
  - node-emoji (Emoji 支持)
- **Build**: TypeScript 编译到 JavaScript
- **Distribution**: npm 包，支持全局安装

### Installation
```bash
npm install -g @muxik/md-viewer
```

### Usage
```bash
# 基本用法
mdview README.md

# 主题选择
mdview --theme light document.md

# 禁用分页
mdview --no-pager file.md

# 管道输入
echo "# Hello World" | mdview
```

---

## 版本规范说明

本项目遵循 [语义化版本](https://semver.org/) 规范：

- **MAJOR**: 不兼容的 API 更改
- **MINOR**: 向后兼容的功能性新增
- **PATCH**: 向后兼容的问题修正

### 变更类型说明

- `Added` - 新增功能
- `Changed` - 对现有功能的变更
- `Deprecated` - 即将移除的功能
- `Removed` - 已移除的功能
- `Fixed` - 错误修复
- `Security` - 安全问题修复

---

## 未来计划 (Roadmap)

### v1.1.0 (计划中)
- 🎨 更多内置主题
- 📊 更好的表格渲染
- 🔍 搜索功能
- 📋 目录导航

### v1.2.0 (计划中)
- 🖼️ 图片预览支持
- 📖 书签功能
- 🎵 音频/视频链接处理
- 🔗 更智能的链接处理

### v2.0.0 (远期计划)
- 🎛️ 插件系统
- 🎨 自定义主题支持
- 📝 配置文件支持
- 🌐 Web 界面（可选）

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/muxik/md-viewer/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/muxik/md-viewer/discussions)
- 🤝 **代码贡献**: Fork → 开发 → PR

## 许可证

[MIT License](LICENSE) © 2025 muxik
