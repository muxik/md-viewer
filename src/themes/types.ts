export interface Theme {
  name: string;
  colors: {
    heading: string;
    text: string;
    link: string;
    code: string;
    codeBlock: string;
    quote: string;
    strong: string;
    em: string;
    del: string;
    hr: string;
    listBullet: string;
    background: string;
    border: string;
    accent: string;
  };
  styles: {
    heading: {
      prefix: string;
      suffix: string;
    };
    quote: {
      prefix: string;
      suffix: string;
    };
    list: {
      bullet: string;
      number: string;
    };
    code: {
      prefix: string;
      suffix: string;
    };
    hr: {
      char: string;
      length: number;
    };
  };
}
