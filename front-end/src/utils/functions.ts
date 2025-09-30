const EXT_TO_LANG = {
  // sh: "bash", // 和 shell 一致，让其自己识别
  c: "c",
  cpp: "cpp",
  cc: "cpp",
  cs: "csharp",
  css: "css",
  diff: "diff",
  go: "go",
  graphql: "graphql",
  gql: "graphql",
  ini: "ini",
  java: "java",
  js: "javascript",
  json: "json",
  kt: "kotlin",
  kts: "kotlin",
  less: "less",
  lua: "lua",
  // "makefile",
  md: "markdown",
  m: "objectivec",
  h: "objectivec",
  pl: "perl",
  php: "php",
  "php-template": "php-template",
  txt: "plaintext",
  py: "python",
  // "python-repl",
  r: "r",
  rb: "ruby",
  rs: "rust",
  scss: "scss",
  // sh: "shell",
  sql: "sql",
  swift: "swift",
  ts: "typescript",
  tsx: "typescript",
  vb: "vbnet",
  wasm: "wasm",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
} as const;

/**
 * 获取文件的文本内容
 */
export function getFileContent(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsText(file);
    } catch (e) {
      console.warn(e);
      resolve("");
    }
  });
}

/**
 * 获取文件后缀
 */
export function getFileExt(filename: string): string | undefined {
  return filename.split(".").pop()?.toLowerCase();
}

/**
 * 获取文件对应语言
 */
export function getFileLang(filename: string): string | undefined {
  return EXT_TO_LANG[getFileExt(filename) as keyof typeof EXT_TO_LANG];
}

/**
 * 将 html 拆解为 tag、entity、character
 */
export function formatHtmlToWords(html: string): Array<string> {
  const items: Array<string> = [];
  let mode: "tag" | "entity" | "char" = "char";
  let item: string = "";

  function handleMode(char: string, newMode: typeof mode): void {
    if (item.length > 0) items.push(item);
    item = char;
    mode = newMode;
  }

  for (let i = 0; i < html.length; i += 1) {
    const char = html[i];
    switch (mode) {
      case "char" as typeof mode: {
        if (char === "<") {
          handleMode(char, "tag");
        } else if (char === "&") {
          handleMode(char, "entity");
        } else {
          item += char;
        }
        break;
      }

      case "tag" as typeof mode: {
        if (char === ">") {
          item += char;
          handleMode("", "char");
        } else {
          item += char;
        }
        break;
      }

      case "entity" as typeof mode: {
        if (char === ";") {
          item += char;
          handleMode("", "char");
        } else {
          item += char;
        }
        break;
      }
    }
  }

  handleMode("", "char");

  return items;
}
