import { marked } from 'marked';
import { MarkdownToken, ParsedMarkdown, ParserOptions } from './types';

export class MarkdownParser {
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = {
      gfm: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      ...options
    };

    marked.setOptions({
      gfm: this.options.gfm,
      breaks: this.options.breaks,
      pedantic: this.options.pedantic,
      sanitize: this.options.sanitize,
      smartLists: this.options.smartLists,
      smartypants: this.options.smartypants,
    });
  }

  parse(content: string): ParsedMarkdown {
    const tokens = marked.lexer(content);
    const parsedTokens = this.processTokens(tokens);
    
    const title = this.extractTitle(parsedTokens);
    
    return {
      tokens: parsedTokens,
      title
    };
  }

  private processTokens(tokens: any[]): MarkdownToken[] {
    return tokens.map(token => this.processToken(token)).filter((token): token is MarkdownToken => token !== null);
  }

  private processToken(token: any): MarkdownToken | null {
    switch (token.type) {
      case 'heading':
        return {
          type: 'heading',
          content: token.text,
          level: token.depth,
          raw: token.raw
        };

      case 'paragraph':
        return {
          type: 'paragraph',
          content: token.text,
          children: token.tokens ? this.processTokens(token.tokens) : undefined,
          raw: token.raw
        };

      case 'code':
        return {
          type: 'code',
          content: token.text,
          lang: token.lang || 'text',
          raw: token.raw
        };

      case 'blockquote':
        return {
          type: 'blockquote',
          content: token.text,
          children: token.tokens ? this.processTokens(token.tokens) : undefined,
          raw: token.raw
        };

      case 'list':
        return {
          type: 'list',
          content: '',
          ordered: token.ordered,
          children: token.items ? token.items.map((item: any) => this.processToken(item)).filter(Boolean) : [],
          raw: token.raw
        };

      case 'list_item':
        return {
          type: 'list_item',
          content: token.text,
          children: token.tokens ? this.processTokens(token.tokens) : undefined,
          task: token.task,
          checked: token.checked,
          raw: token.raw
        };

      case 'table':
        const tableChildren: MarkdownToken[] = [];
        if (token.header) {
          const headerRow = token.header.map((cell: any) => cell.text).join('|');
          tableChildren.push({ type: 'text', content: headerRow });
        }
        if (token.rows) {
          token.rows.forEach((row: any[]) => {
            const rowContent = row.map((cell: any) => cell.text).join('|');
            tableChildren.push({ type: 'text', content: rowContent });
          });
        }
        return {
          type: 'table',
          content: '',
          children: tableChildren,
          raw: token.raw
        };

      case 'hr':
        return {
          type: 'hr',
          content: '',
          raw: token.raw
        };

      case 'html':
        return {
          type: 'html',
          content: token.text,
          raw: token.raw
        };

      case 'text':
        return {
          type: 'text',
          content: token.text,
          raw: token.raw
        };

      case 'del':
        return {
          type: 'del',
          content: token.text,
          raw: token.raw
        };

      case 'strong':
        return {
          type: 'strong',
          content: token.text,
          raw: token.raw
        };

      case 'em':
        return {
          type: 'em',
          content: token.text,
          raw: token.raw
        };

      case 'code':
        return {
          type: 'code_inline',
          content: token.text,
          raw: token.raw
        };

      case 'link':
        return {
          type: 'link',
          content: token.text,
          href: token.href,
          title: token.title,
          raw: token.raw
        };

      case 'image':
        return {
          type: 'image',
          content: token.text,
          href: token.href,
          title: token.title,
          alt: token.text,
          raw: token.raw
        };

      default:
        return null;
    }
  }

  private extractTitle(tokens: MarkdownToken[]): string | undefined {
    const firstHeading = tokens.find(token => token.type === 'heading' && token.level === 1);
    return firstHeading?.content;
  }
}
