import { Theme } from './types';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    heading: '#61dafb',
    text: '#abb2bf',        // @mono-1: default text
    link: '#61afef',        // @hue-2: blue
    code: '#e06c75',        // @hue-5: red
    codeBlock: '#abb2bf',   // @mono-1: default text
    quote: '#5c6370',       // @mono-2: muted text
    strong: '#abb2bf',      // @mono-1: default text
    em: '#abb2bf',          // @mono-1: default text
    del: '#5c6370',         // @mono-2: muted text
    hr: '#3e4451',          // @mono-3: borders
    listBullet: '#61afef',  // @hue-2: blue
    background: '#282c34',  // @syntax-bg: background
    border: '#3e4451',      // @mono-3: borders
    accent: '#e5c07b'       // @hue-6-2: orange
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
