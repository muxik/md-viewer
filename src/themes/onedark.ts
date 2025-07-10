import { Theme } from './types';

export const onedarkTheme: Theme = {
  name: 'onedark',
  colors: {
    heading: '#61afef',     // @hue-2: blue - 用于标题
    text: '#abb2bf',        // @mono-1: default text
    link: '#61afef',        // @hue-2: blue
    code: '#e06c75',        // @hue-5: red - 行内代码
    codeBlock: '#abb2bf',   // @mono-1: default text
    quote: '#5c6370',       // @mono-2: muted text
    strong: '#e5c07b',      // @hue-6-2: orange - 粗体
    em: '#c678dd',          // @hue-3: purple - 斜体
    del: '#5c6370',         // @mono-2: muted text
    hr: '#3e4451',          // @mono-3: borders
    listBullet: '#61afef',  // @hue-2: blue
    background: '#282c34',  // @syntax-bg: background
    border: '#3e4451',      // @mono-3: borders
    accent: '#e5c07b'       // @hue-6-2: orange - 用于强调
  },
  styles: {
    heading: {
      prefix: '▍',
      suffix: ''
    },
    quote: {
      prefix: '▎ ',
      suffix: ''
    },
    list: {
      bullet: '•',
      number: '.'
    },
    code: {
      prefix: '`',
      suffix: '`'
    },
    hr: {
      char: '─',
      length: 80
    }
  }
};
