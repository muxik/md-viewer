import chalk from 'chalk';
import hljs from 'highlight.js';
import { MarkdownToken } from '../parser';
import { Theme } from '../themes';

export interface RendererOptions {
  theme: Theme;
  width: number;
  showLineNumbers?: boolean;
}

export class TerminalRenderer {
  private theme: Theme;
  private width: number;
  private showLineNumbers: boolean;

  constructor(options: RendererOptions) {
    this.theme = options.theme;
    this.width = options.width;
    this.showLineNumbers = options.showLineNumbers || false;
  }

  render(tokens: MarkdownToken[]): string[] {
    const lines: string[] = [];

    for (const token of tokens) {
      const tokenLines = this.renderToken(token);
      lines.push(...tokenLines);

      if (token.type !== 'list_item') {
        lines.push('');
      }
    }

    return lines.filter((line, index, arr) => {
      if (index === arr.length - 1) return line.trim() !== '';
      return true;
    });
  }

  private renderToken(token: MarkdownToken): string[] {
    switch (token.type) {
      case 'heading':
        return this.renderHeading(token);
      case 'paragraph':
        return this.renderParagraph(token);
      case 'code':
        return this.renderCodeBlock(token);
      case 'blockquote':
        return this.renderBlockquote(token, 0);
      case 'list':
        return this.renderList(token, 0);
      case 'list_item':
        return this.renderListItem(token, 0);
      case 'table':
        return this.renderTable(token);
      case 'hr':
        return this.renderHr();
      case 'html':
        return this.renderHtml(token);
      case 'text':
        return this.renderText(token);
      case 'del':
        return this.renderDel(token);
      case 'image':
        return this.renderImage(token);
      default:
        return [];
    }
  }

  private renderHeading(token: MarkdownToken): string[] {
    const level = token.level || 1;
    const prefix = this.theme.styles.heading.prefix;
    const color = this.theme.colors.heading;

    let content = token.content;
    let formattedContent = '';

    switch (level) {
      case 1:
        formattedContent = chalk.hex(color).bold.underline(content);
        break;
      case 2:
        formattedContent = chalk.hex(color).bold(content);
        break;
      case 3:
        formattedContent = chalk.hex(color).bold(content);
        break;
      default:
        formattedContent = chalk.hex(color)(content);
    }

    const line = `${chalk.hex(color)(prefix)} ${formattedContent}`;
    return [line];
  }

  private renderParagraph(token: MarkdownToken): string[] {
    if (token.children) {
      // 处理段落中的内联token
      let content = '';
      for (const child of token.children) {
        switch (child.type) {
          case 'text':
            content += child.content;
            break;
          case 'del':
            content += chalk.hex(this.theme.colors.del).strikethrough(child.content);
            break;
          case 'strong':
            content += chalk.hex(this.theme.colors.strong).bold(child.content);
            break;
          case 'em':
            content += chalk.hex(this.theme.colors.em).italic(child.content);
            break;
          case 'code_inline':
            content += chalk.hex(this.theme.colors.code)(`${this.theme.styles.code.prefix}${child.content}${this.theme.styles.code.suffix}`);
            break;
          case 'link':
            content += chalk.hex(this.theme.colors.link).underline(child.content);
            break;
          case 'image':
            const alt = child.content || child.alt || '图片';
            const url = child.href || child.url || '';
            content += chalk.hex(this.theme.colors.link).underline(`[图片: ${alt}] ${url}`);
            break;
          default:
            content += child.content;
        }
      }
      return this.wrapText(content, this.width);
    } else {
      // 回退到原有的处理方式
      const content = this.processInlineTokens(token.content);
      return this.wrapText(content, this.width);
    }
  }

  private renderCodeBlock(token: MarkdownToken): string[] {
    const lang = token.lang || 'text';
    const content = token.content;

    let highlightedCode: string;
    try {
      const result = hljs.highlight(content, { language: lang });
      highlightedCode = this.convertHtmlToTerminalColors(result.value);
    } catch (error) {
      highlightedCode = chalk.hex(this.theme.colors.codeBlock)(content);
    }

    const lines = highlightedCode.split('\n');
    const paddedLines = lines.map(line => `  ${line}`);

    const borderColor = this.theme.colors.border;
    const topBorder = chalk.hex(borderColor)('┌' + '─'.repeat(this.width - 2) + '┐');
    const bottomBorder = chalk.hex(borderColor)('└' + '─'.repeat(this.width - 2) + '┘');

    return [topBorder, ...paddedLines, bottomBorder];
  }

  private renderBlockquote(token: MarkdownToken, depth: number = 0): string[] {
    const prefix = this.theme.styles.quote.prefix;
    const color = this.theme.colors.quote;
    const lines: string[] = [];

    // 计算缩进和可用宽度
    const indentSize = depth * 2;
    const availableWidth = this.width - indentSize - 2;

    if (token.children) {
      // 处理引用块中的子token
      for (const child of token.children) {
        let childLines: string[];
        if (child.type === 'blockquote') {
          // 递归处理嵌套引用
          childLines = this.renderBlockquote(child, depth + 1);
        } else {
          // 处理其他类型的子token
          childLines = this.renderTokenWithWidth(child, availableWidth);
        }
        lines.push(...childLines);
      }
    } else {
      // 回退到原有的处理方式
      const content = this.processInlineTokens(token.content);
      const textLines = this.wrapText(content, availableWidth);
      lines.push(...textLines);
    }

    // 添加引用前缀和颜色
    const indent = ' '.repeat(indentSize);
    return lines.map(line => `${indent}${chalk.hex(color)(prefix)}${chalk.hex(color)(line)}`);
  }

  private renderList(token: MarkdownToken, depth: number = 0): string[] {
    const lines: string[] = [];
    const ordered = token.ordered || false;
    const indent = '  '.repeat(depth);

    if (token.children) {
      token.children.forEach((item, index) => {
        let marker: string;
        let markerColor = this.theme.colors.listBullet;

        if (item.task) {
          // 待办事项
          marker = item.checked ? '☑' : '☐';
          markerColor = item.checked ? this.theme.colors.accent : this.theme.colors.text;
        } else {
          // 普通列表项
          marker = ordered ? `${index + 1}${this.theme.styles.list.number}` : this.theme.styles.list.bullet;
        }

        const itemLines = this.renderListItem(item, depth);

        if (itemLines.length > 0) {
          const firstLine = `${indent}  ${chalk.hex(markerColor)(marker)} ${itemLines[0]}`;
          const restLines = itemLines.slice(1).map(line => `${indent}     ${line}`);
          lines.push(firstLine, ...restLines);
        }
      });
    }

    return lines;
  }

  private renderListItem(token: MarkdownToken, depth: number = 0): string[] {
    const lines: string[] = [];

    if (token.children) {
      // 处理列表项的所有子token
      for (const child of token.children) {
        if (child.type === 'text') {
          const content = this.processInlineTokens(child.content);
          const textLines = this.wrapText(content, this.width - 5 - (depth * 2));
          lines.push(...textLines);
        } else if (child.type === 'list') {
          // 递归处理嵌套列表
          const nestedLines = this.renderList(child, depth + 1);
          lines.push(...nestedLines);
        } else {
          // 处理其他类型的token
          const childLines = this.renderToken(child);
          lines.push(...childLines);
        }
      }
    } else {
      // 如果没有子token，使用原来的逻辑
      const content = this.processInlineTokens(token.content);
      const textLines = this.wrapText(content, this.width - 5 - (depth * 2));
      lines.push(...textLines);
    }

    return lines;
  }

  private renderTable(token: MarkdownToken): string[] {
    if (!token.children || token.children.length === 0) {
      return [];
    }

    const rows = token.children.map(child => child.content.split('|').map(cell => cell.trim()));
    const maxCols = Math.max(...rows.map(row => row.length));

    // 计算每列的最大宽度（考虑中文字符）
    const colWidths = Array(maxCols).fill(0);
    rows.forEach(row => {
      row.forEach((cell, index) => {
        if (index < colWidths.length) {
          const displayWidth = this.getDisplayWidth(cell);
          colWidths[index] = Math.max(colWidths[index], displayWidth);
        }
      });
    });

    // 确保表格不会超出终端宽度
    const totalWidth = colWidths.reduce((sum, width) => sum + width, 0) + (maxCols - 1) * 3 + 4; // 3 for " | ", 4 for "| ... |"
    if (totalWidth > this.width) {
      this.adjustColumnWidths(colWidths, this.width - (maxCols - 1) * 3 - 4);
    }

    const lines: string[] = [];
    const borderColor = this.theme.colors.border;
    const headerColor = this.theme.colors.heading;

    // 顶部边框
    const topBorder = '┌' + colWidths.map(width => '─'.repeat(width + 2)).join('┬') + '┐';
    lines.push(chalk.hex(borderColor)(topBorder));

    rows.forEach((row, rowIndex) => {
      const formattedCells = row.map((cell, colIndex) => {
        const width = colWidths[colIndex] || 0;
        // 处理表格单元格中的行内格式
        let processedCell = cell;
        if (rowIndex === 0) {
          // 标题行：先加粗，再处理内联格式
          processedCell = chalk.hex(headerColor).bold(cell);
        } else {
          // 普通行：处理内联格式
          processedCell = this.processInlineTokens(cell);
        }
        const content = this.padCellWithAnsi(processedCell, width);
        return content;
      });

      const rowLine = chalk.hex(borderColor)('│') + ' ' + formattedCells.join(' ' + chalk.hex(borderColor)('│') + ' ') + ' ' + chalk.hex(borderColor)('│');
      lines.push(rowLine);

      if (rowIndex === 0) {
        // 标题行下的分隔线
        const separator = '├' + colWidths.map(width => '─'.repeat(width + 2)).join('┼') + '┤';
        lines.push(chalk.hex(borderColor)(separator));
      }
    });

    // 底部边框
    const bottomBorder = '└' + colWidths.map(width => '─'.repeat(width + 2)).join('┴') + '┘';
    lines.push(chalk.hex(borderColor)(bottomBorder));

    return lines;
  }

  private getDisplayWidth(text: string): number {
    // 简单的中文字符宽度计算
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      // 中文字符、全角字符和表情符号占用2个字符宽度
      if (
        (code >= 0x4e00 && code <= 0x9fff) ||  // 中文字符
        (code >= 0x3400 && code <= 0x4dbf) ||  // 扩展中文字符
        (code >= 0xff00 && code <= 0xffef) ||  // 全角字符
        (code >= 0x2600 && code <= 0x26ff) ||  // 表情符号
        (code >= 0x2700 && code <= 0x27bf) ||  // 装饰符号
        char.match(/[\u{1f600}-\u{1f64f}]/u) || // 表情符号
        char.match(/[\u{1f300}-\u{1f5ff}]/u) || // 符号和象形文字
        char.match(/[\u{1f680}-\u{1f6ff}]/u) || // 交通和地图符号
        char.match(/[\u{1f700}-\u{1f77f}]/u) || // 炼金术符号
        char.match(/[\u{1f780}-\u{1f7ff}]/u) || // 几何形状扩展
        char.match(/[\u{1f800}-\u{1f8ff}]/u) || // 补充箭头C
        char.match(/[\u{1f900}-\u{1f9ff}]/u)    // 补充符号和象形文字
      ) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  private padCell(text: string, targetWidth: number): string {
    const displayWidth = this.getDisplayWidth(text);
    const padding = Math.max(0, targetWidth - displayWidth);
    return text + ' '.repeat(padding);
  }

  private padCellWithAnsi(text: string, targetWidth: number): string {
    // 清理 ANSI 转义序列后计算显示宽度
    const cleanText = this.stripAnsiCodes(text);
    const displayWidth = this.getDisplayWidth(cleanText);

    // 计算需要的填充空格数
    const padding = Math.max(0, targetWidth - displayWidth);

    // 返回原文本加上填充空格
    return text + ' '.repeat(padding);
  }

  private stripAnsiCodes(text: string): string {
    // 移除所有 ANSI 转义序列，包括颜色、样式等
    return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
  }

  private adjustColumnWidths(colWidths: number[], availableWidth: number): void {
    const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
    if (totalWidth <= availableWidth) return;

    // 按比例缩减列宽
    const scale = availableWidth / totalWidth;
    for (let i = 0; i < colWidths.length; i++) {
      colWidths[i] = Math.floor(colWidths[i] * scale);
      // 确保最小宽度为3
      if (colWidths[i] < 3) colWidths[i] = 3;
    }
  }

  private renderHr(): string[] {
    const char = this.theme.styles.hr.char;
    const length = Math.min(this.theme.styles.hr.length, this.width);
    const line = char.repeat(length);
    return [chalk.hex(this.theme.colors.hr)(line)];
  }

  private renderHtml(token: MarkdownToken): string[] {
     let content = token.content;

    // 移除所有HTML注释
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // 如果移除注释后内容为空或只有空白，则不渲染
    if (!content.trim()) {
      return [];
    }

    // 对于其他HTML内容，以淡色显示
    return [chalk.hex(this.theme.colors.text).dim(content)];
  }

  private renderText(token: MarkdownToken): string[] {
    const content = this.processInlineTokens(token.content);
    return this.wrapText(content, this.width);
  }

  private renderDel(token: MarkdownToken): string[] {
    const content = chalk.hex(this.theme.colors.del).strikethrough(token.content);
    return this.wrapText(content, this.width);
  }

  private renderImage(token: MarkdownToken): string[] {
    const alt = token.content || token.alt || '图片';
    const url = token.href || token.url || '';
    const content = chalk.hex(this.theme.colors.link).underline(`[图片: ${alt}] ${url}`);
    return this.wrapText(content, this.width);
  }

  private renderTokenWithWidth(token: MarkdownToken, width: number): string[] {
    const originalWidth = this.width;
    this.width = width;

    try {
      const result = this.renderToken(token);
      return result;
    } finally {
      this.width = originalWidth;
    }
  }

  private processInlineTokens(content: string): string {
    const textColor = this.theme.colors.text;
    const linkColor = this.theme.colors.link;
    const codeColor = this.theme.colors.code;
    const strongColor = this.theme.colors.strong;
    const emColor = this.theme.colors.em;
    const delColor = this.theme.colors.del;

    // 使用占位符保护已处理的内容
    const placeholders: string[] = [];
    let result = content;

    // 1. 先处理行内代码，用占位符替换
    result = result.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__PLACEHOLDER_${placeholders.length}__`;
      const formatted = chalk.hex(codeColor)(`${this.theme.styles.code.prefix}${code}${this.theme.styles.code.suffix}`);
      placeholders.push(formatted);
      return placeholder;
    });

    // 2. 处理图片链接
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      const placeholder = `__PLACEHOLDER_${placeholders.length}__`;
      const formatted = chalk.hex(linkColor).underline(`[图片: ${alt || '图片'}] ${url}`);
      placeholders.push(formatted);
      return placeholder;
    });

    // 3. 处理普通链接
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const placeholder = `__PLACEHOLDER_${placeholders.length}__`;
      const formatted = chalk.hex(linkColor).underline(text);
      placeholders.push(formatted);
      return placeholder;
    });

    // 4. 处理直接URL
    result = result.replace(/https?:\/\/[^\s]+/g, (url) => {
      const placeholder = `__PLACEHOLDER_${placeholders.length}__`;
      const formatted = chalk.hex(linkColor).underline(url);
      placeholders.push(formatted);
      return placeholder;
    });

    // 5. 处理粗斜体（三个星号）
    result = result.replace(/\*\*\*(.*?)\*\*\*/g, (_, text) => chalk.hex(strongColor).bold.italic(text));

    // 6. 处理粗体（两个星号）
    result = result.replace(/\*\*(.*?)\*\*/g, (_, text) => chalk.hex(strongColor).bold(text));

    // 7. 处理斜体（一个星号）
    result = result.replace(/\*(.*?)\*/g, (_, text) => chalk.hex(emColor).italic(text));

    // 8. 处理删除线
    result = result.replace(/~~(.*?)~~/g, (_, text) => chalk.hex(delColor).strikethrough(text));

    // 9. 恢复占位符
    placeholders.forEach((formatted, index) => {
      result = result.replace(`__PLACEHOLDER_${index}__`, formatted);
    });

    return result || chalk.hex(textColor)(content);
  }

  private wrapText(text: string, width: number): string[] {
    if (!text) return [''];

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const cleanTestLine = testLine.replace(/\x1b\[[0-9;]*m/g, '');

      if (cleanTestLine.length <= width) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }

  private convertHtmlToTerminalColors(html: string): string {
    // One Dark 配色方案
    const colorMap: Record<string, string> = {
      'hljs-keyword': '#c678dd',      // 关键字 - 紫色 (@hue-3)
      'hljs-string': '#98c379',       // 字符串 - 绿色 (@hue-4)
      'hljs-comment': '#5c6370',      // 注释 - 灰色 (@mono-2)
      'hljs-number': '#d19a66',       // 数字 - 橙色 (@hue-6)
      'hljs-function': '#61afef',     // 函数 - 蓝色 (@hue-2)
      'hljs-variable': '#e06c75',     // 变量 - 红色 (@hue-5)
      'hljs-type': '#56b6c2',         // 类型 - 青色 (@hue-1)
      'hljs-built_in': '#e5c07b',     // 内置函数 - 黄色 (@hue-6-2)
      'hljs-title': '#61afef',        // 标题 - 蓝色 (@hue-2)
      'hljs-params': '#abb2bf',       // 参数 - 默认文本 (@mono-1)
      'hljs-literal': '#56b6c2',      // 字面量 - 青色 (@hue-1)
      'hljs-regexp': '#e06c75',       // 正则表达式 - 红色 (@hue-5)
      'hljs-class': '#e5c07b',        // 类 - 黄色 (@hue-6-2)
      'hljs-attr': '#d19a66',         // 属性 - 橙色 (@hue-6)
      'hljs-tag': '#e06c75',          // 标签 - 红色 (@hue-5)
      'hljs-name': '#e06c75',         // 名称 - 红色 (@hue-5)
      'hljs-selector-tag': '#e06c75', // 选择器 - 红色 (@hue-5)
      'hljs-selector-class': '#d19a66', // 选择器类 - 橙色 (@hue-6)
      'hljs-selector-id': '#61afef',  // 选择器ID - 蓝色 (@hue-2)
      'hljs-meta': '#61afef',         // 元信息 - 蓝色 (@hue-2)
      'hljs-doctag': '#c678dd',       // 文档标签 - 紫色 (@hue-3)
      'hljs-section': '#e5c07b',      // 章节 - 黄色 (@hue-6-2)
      'hljs-attribute': '#d19a66',    // 属性 - 橙色 (@hue-6)
      'hljs-subst': '#e06c75',        // 替换 - 红色 (@hue-5)
      'hljs-formula': '#56b6c2',      // 公式 - 青色 (@hue-1)
      'hljs-addition': '#98c379',     // 添加 - 绿色 (@hue-4)
      'hljs-deletion': '#e06c75',     // 删除 - 红色 (@hue-5)
      'hljs-quote': '#5c6370',        // 引用 - 灰色 (@mono-2)
      'hljs-emphasis': '#abb2bf',     // 强调 - 默认文本 (@mono-1)
      'hljs-strong': '#abb2bf',       // 加粗 - 默认文本 (@mono-1)
      'hljs-link': '#61afef',         // 链接 - 蓝色 (@hue-2)
      'hljs-symbol': '#56b6c2',       // 符号 - 青色 (@hue-1)
      'hljs-bullet': '#abb2bf',       // 项目符号 - 默认文本 (@mono-1)
      'hljs-code': '#e06c75',         // 代码 - 红色 (@hue-5)
      'hljs-template-tag': '#c678dd', // 模板标签 - 紫色 (@hue-3)
      'hljs-template-variable': '#e06c75', // 模板变量 - 红色 (@hue-5)
      'hljs-operator': '#56b6c2',     // 操作符 - 青色 (@hue-1)
      'hljs-punctuation': '#abb2bf',  // 标点 - 默认文本 (@mono-1)
      'hljs-property': '#e06c75',     // 属性 - 红色 (@hue-5)
      'hljs-title.function': '#61afef', // 函数标题 - 蓝色 (@hue-2)
      'hljs-title.class': '#e5c07b',  // 类标题 - 黄色 (@hue-6-2)
      'hljs-variable.language': '#c678dd', // 语言变量 - 紫色 (@hue-3)
      'hljs-variable.constant': '#d19a66', // 常量 - 橙色 (@hue-6)
    };

    let result = html;

    // 递归处理嵌套的 HTML 标签，从内到外
    let hasMatches = true;
    while (hasMatches) {
      const beforeReplace = result;
      result = result.replace(/<span class="([^"]+)">([^<]*)<\/span>/g, (match, className, content) => {
        // 处理复合类名，取第一个有效的类名
        const classes = className.split(' ');
        let color = this.theme.colors.codeBlock;

        for (const cls of classes) {
          if (colorMap[cls]) {
            color = colorMap[cls];
            break;
          }
        }

        return chalk.hex(color)(content);
      });

      hasMatches = result !== beforeReplace;
    }

    // 处理剩余的 HTML 标签
    result = result.replace(/<[^>]*>/g, '');

    // 解码 HTML 实体
    result = result
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    // 如果没有任何高亮，使用默认颜色
    if (result === html) {
      result = chalk.hex(this.theme.colors.codeBlock)(html);
    }

    return result;
  }

  private cleanHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
