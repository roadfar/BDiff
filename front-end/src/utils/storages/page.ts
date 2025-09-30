export const DEFAULT_THEME: Theme = "light";

export const THEMES: Array<Theme> = ["light", "dark"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTheme(value: any): value is Theme {
  return THEMES.includes(value);
}

export function setTheme(theme?: Theme) {
  theme = getTheme(theme);
  document.documentElement.dataset.bsTheme = theme;
  localStorage.setItem("THEME", theme);
}

export function getTheme(theme?: Theme | null): Theme {
  theme = theme || (localStorage.getItem("THEME") as Theme | null);
  return isTheme(theme) ? theme : DEFAULT_THEME;
}
