import { I18N_MESSAGES, type I18N_LANGS } from "@/utils/i18n/i18n.ts";

export const DEFAULT_LOCALE: I18N_LANGS = "en";

export function setLang(lang: string): void {
  localStorage.setItem("LANG", lang);
}

export function getLang(): I18N_LANGS {
  const lang = localStorage.getItem("LANG");
  return lang && Object.keys(I18N_MESSAGES).includes(lang) ? (lang as I18N_LANGS) : DEFAULT_LOCALE;
}
