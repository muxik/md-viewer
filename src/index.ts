import { readFileSync } from 'fs';
import { MarkdownParser } from './parser';
import { TerminalRenderer } from './renderer';
import { Pager } from './pager';
import { getTheme } from './themes';

export interface MdviewOptions {
  theme?: string;
  width?: number;
  showLineNumbers?: boolean;
  noPager?: boolean;
}

export class Mdview {
  private parser: MarkdownParser;
  private options: MdviewOptions;

  constructor(options: MdviewOptions = {}) {
    this.options = {
      theme: 'onedark',
      width: process.stdout.columns || 80,
      showLineNumbers: false,
      noPager: false,
      ...options
    };
    
    this.parser = new MarkdownParser();
  }

  async renderFile(filePath: string): Promise<void> {
    try {
      const content = readFileSync(filePath, 'utf8');
      await this.renderContent(content, filePath);
    } catch (error) {
      throw new Error(`Failed to read file: ${filePath}`);
    }
  }

  async renderContent(content: string, title?: string): Promise<void> {
    const parsed = this.parser.parse(content);
    const theme = getTheme(this.options.theme || 'onedark');
    
    const renderer = new TerminalRenderer({
      theme,
      width: this.options.width || 80,
      showLineNumbers: this.options.showLineNumbers
    });
    
    const lines = renderer.render(parsed.tokens);
    
    if (this.options.noPager || lines.length <= (process.stdout.rows || 24) - 2) {
      lines.forEach(line => console.log(line));
    } else {
      const pager = new Pager(lines, {
        theme,
        title: title || parsed.title,
        showLineNumbers: this.options.showLineNumbers
      });
      
      await pager.show();
    }
  }
}

export * from './parser';
export * from './renderer';
export * from './pager';
export * from './themes';
