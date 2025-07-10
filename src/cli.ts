#!/usr/bin/env node

import { program } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Mdview } from './index';

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('mdview')
  .description('A CLI tool for rendering Markdown files with syntax highlighting and pagination')
  .version(packageJson.version)
  .argument('[file]', 'Markdown file to render')
  .option('-t, --theme <theme>', 'Theme to use (onedark, dark, light)', 'onedark')
  .option('-w, --width <width>', 'Terminal width override', (value) => parseInt(value))
  .option('-n, --line-numbers', 'Show line numbers')
  .option('--no-pager', 'Disable pager and print to stdout')
  .option('--list-themes', 'List available themes')
  .action(async (file, options) => {
    try {
      if (options.listThemes) {
        console.log('Available themes:');
        console.log('  - onedark (default) - One Dark color scheme');
        console.log('  - dark - GitHub dark theme');
        console.log('  - light - GitHub light theme');
        return;
      }

      if (!file) {
        if (process.stdin.isTTY) {
          program.help();
          return;
        }
        
        let content = '';
        process.stdin.setEncoding('utf8');
        
        for await (const chunk of process.stdin) {
          content += chunk;
        }
        
        if (content.trim()) {
          const mdview = new Mdview({
            theme: options.theme,
            width: options.width,
            showLineNumbers: options.lineNumbers,
            noPager: !options.pager
          });
          
          await mdview.renderContent(content, 'stdin');
        }
        return;
      }

      if (!existsSync(file)) {
        console.error(`Error: File "${file}" not found`);
        process.exit(1);
      }

      const mdview = new Mdview({
        theme: options.theme,
        width: options.width,
        showLineNumbers: options.lineNumbers,
        noPager: !options.pager
      });

      await mdview.renderFile(file);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse();
}

export { program };
