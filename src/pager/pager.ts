import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'process';
import chalk from 'chalk';
import { Theme } from '../themes';

export interface PagerOptions {
  theme: Theme;
  title?: string;
  showLineNumbers?: boolean;
}

export class Pager {
  private lines: string[];
  private currentLine: number = 0;
  private terminalHeight: number;
  private terminalWidth: number;
  private theme: Theme;
  private title?: string;
  private showLineNumbers: boolean;
  private rl: any;

  constructor(lines: string[], options: PagerOptions) {
    this.lines = lines;
    this.theme = options.theme;
    this.title = options.title;
    this.showLineNumbers = options.showLineNumbers || false;
    this.terminalHeight = process.stdout.rows || 24;
    this.terminalWidth = process.stdout.columns || 80;
    
    this.rl = createInterface({
      input,
      output,
      terminal: true
    });
  }

  async show(): Promise<void> {
    return new Promise((resolve) => {
      this.setupTerminal();
      this.render();
      
      this.rl.input.setRawMode(true);
      this.rl.input.resume();
      
      this.rl.input.on('keypress', (str: string, key: any) => {
        this.handleKeyPress(key, resolve);
      });
    });
  }

  private setupTerminal(): void {
    process.stdout.write('\x1B[?1049h');
    process.stdout.write('\x1B[2J');
    process.stdout.write('\x1B[H');
    
    process.on('SIGWINCH', () => {
      this.terminalHeight = process.stdout.rows || 24;
      this.terminalWidth = process.stdout.columns || 80;
      this.render();
    });
  }

  private render(): void {
    const contentHeight = this.terminalHeight - 2;
    const visibleLines = this.lines.slice(this.currentLine, this.currentLine + contentHeight);
    
    process.stdout.write('\x1B[2J');
    process.stdout.write('\x1B[H');
    
    this.renderHeader();
    this.renderContent(visibleLines);
    this.renderFooter();
  }

  private renderHeader(): void {
    const headerBg = this.theme.colors.accent;
    const headerText = this.theme.colors.background;
    
    let header = this.title || 'mdview';
    if (header.length > this.terminalWidth - 4) {
      header = header.substring(0, this.terminalWidth - 7) + '...';
    }
    
    const padding = this.terminalWidth - header.length;
    const paddedHeader = header + ' '.repeat(Math.max(0, padding));
    
    process.stdout.write(chalk.hex(headerText).bgHex(headerBg)(paddedHeader));
    process.stdout.write('\n');
  }

  private renderContent(visibleLines: string[]): void {
    const startLineNumber = this.currentLine + 1;
    
    visibleLines.forEach((line, index) => {
      let displayLine = line;
      
      if (this.showLineNumbers) {
        const lineNumber = startLineNumber + index;
        const lineNumberStr = lineNumber.toString().padStart(4, ' ');
        const lineNumberColor = this.theme.colors.accent;
        displayLine = `${chalk.hex(lineNumberColor)(lineNumberStr)} │ ${line}`;
      }
      
      if (displayLine.length > this.terminalWidth) {
        displayLine = displayLine.substring(0, this.terminalWidth - 3) + '...';
      }
      
      process.stdout.write(displayLine);
      process.stdout.write('\n');
    });
  }

  private renderFooter(): void {
    const footerBg = this.theme.colors.border;
    const footerText = this.theme.colors.text;
    
    const totalLines = this.lines.length;
    const currentPage = Math.floor(this.currentLine / (this.terminalHeight - 2)) + 1;
    const totalPages = Math.ceil(totalLines / (this.terminalHeight - 2));
    
    const progress = totalLines > 0 ? Math.round((this.currentLine + this.terminalHeight - 2) / totalLines * 100) : 100;
    const progressStr = progress > 100 ? '100%' : `${progress}%`;
    
    const leftStatus = `Line ${this.currentLine + 1}/${totalLines}`;
    const rightStatus = `${progressStr} | Page ${currentPage}/${totalPages}`;
    const helpText = 'q:quit ↑/↓:scroll PgUp/PgDn:page g/G:top/bottom';
    
    const availableWidth = this.terminalWidth - leftStatus.length - rightStatus.length;
    const centeredHelp = availableWidth > helpText.length ? 
      helpText.padStart((availableWidth + helpText.length) / 2).padEnd(availableWidth) : 
      helpText.substring(0, availableWidth);
    
    const footer = leftStatus + centeredHelp + rightStatus;
    const paddedFooter = footer.padEnd(this.terminalWidth);
    
    process.stdout.write(chalk.hex(footerText).bgHex(footerBg)(paddedFooter));
  }

  private handleKeyPress(key: any, resolve: () => void): void {
    const contentHeight = this.terminalHeight - 2;
    
    switch (key.name) {
      case 'q':
      case 'escape':
        this.cleanup();
        resolve();
        break;
        
      case 'up':
        if (this.currentLine > 0) {
          this.currentLine--;
          this.render();
        }
        break;
        
      case 'down':
        if (this.currentLine < this.lines.length - 1) {
          this.currentLine++;
          this.render();
        }
        break;
        
      case 'pageup':
        this.currentLine = Math.max(0, this.currentLine - contentHeight);
        this.render();
        break;
        
      case 'pagedown':
        this.currentLine = Math.min(this.lines.length - 1, this.currentLine + contentHeight);
        this.render();
        break;
        
      case 'g':
        this.currentLine = 0;
        this.render();
        break;
        
      case 'G':
        this.currentLine = Math.max(0, this.lines.length - contentHeight);
        this.render();
        break;
        
      case 'home':
        this.currentLine = 0;
        this.render();
        break;
        
      case 'end':
        this.currentLine = Math.max(0, this.lines.length - contentHeight);
        this.render();
        break;
        
      default:
        if (key.ctrl && key.name === 'c') {
          this.cleanup();
          process.exit(0);
        }
        break;
    }
  }

  private cleanup(): void {
    process.stdout.write('\x1B[?1049l');
    this.rl.input.setRawMode(false);
    this.rl.close();
  }
}