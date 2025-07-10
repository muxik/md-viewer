import { Theme } from './types';

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    heading: '#0969da',
    text: '#24292f',
    link: '#0969da',
    code: '#cf222e',
    codeBlock: '#24292f',
    quote: '#656d76',
    strong: '#24292f',
    em: '#24292f',
    del: '#656d76',
    hr: '#d0d7de',
    listBullet: '#0969da',
    background: '#ffffff',
    border: '#d0d7de',
    accent: '#fd7e14'
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
