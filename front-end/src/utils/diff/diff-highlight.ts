import hljs from "highlight.js/lib/common";

export function highlightContent(content: string, language: string | undefined): string {
  return language ? hljs.highlight(content, { language }).value : hljs.highlightAuto(content).value;
}
