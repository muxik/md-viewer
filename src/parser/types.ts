export interface MarkdownToken {
  type: 'heading' | 'paragraph' | 'code' | 'blockquote' | 'list' | 'list_item' | 'table' | 'hr' | 'html' | 'link' | 'image' | 'text' | 'strong' | 'em' | 'del' | 'code_inline';
  content: string;
  level?: number;
  lang?: string;
  href?: string;
  title?: string;
  alt?: string;
  url?: string;
  ordered?: boolean;
  children?: MarkdownToken[];
  raw?: string;
  task?: boolean;
  checked?: boolean;
}

export interface ParsedMarkdown {
  tokens: MarkdownToken[];
  title?: string;
}

export interface ParserOptions {
  gfm?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
  sanitize?: boolean;
  smartLists?: boolean;
  smartypants?: boolean;
}
