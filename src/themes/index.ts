import { Theme } from './types';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import { onedarkTheme } from './onedark';

export * from './types';
export { darkTheme, lightTheme, onedarkTheme };

export const themes: Record<string, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  onedark: onedarkTheme
};

export function getTheme(name: string): Theme {
  return themes[name] || onedarkTheme;
}
