import { findLastIndex } from "lodash";

/**
 * 生成差异脚本的中间连线
 */
export function initDiffLinesMap(
  f1Lines: Array<ContentLinesItem>,
  f2Lines: Array<ContentLinesItem>,
  diffDataMap: DiffDataMap,
  options: { diffAlign: boolean },
): DiffLinesMap {
  const { diffAlign } = options;
  const linesMap: DiffLinesMap = new Map();

  /**
   * 对齐时按 diff_id 设定连线的端点
   *
   * id 即是 diff_id 也是 content_line_id
   */

  for (const [id, diff] of diffDataMap) {
    let as: number;
    let ae: number;
    let bs: number;
    let be: number;

    if (diffAlign) {
      /**
       * 对齐时按 diff_id 设定连线的端点
       * 注意排除空行的影响
       */

      // 左侧的有效行
      function validALine(diff: DiffDataItem, line: ContentLinesItem, id: DiffDataId): boolean {
        return (diff.mode === "insert" || line.number !== null) && line.ids.includes(id);
      }

      // 右侧的有效行
      function validBLine(diff: DiffDataItem, line: ContentLinesItem, id: DiffDataId): boolean {
        return (diff.mode === "delete" || line.number !== null) && line.ids.includes(id);
      }

      as = f1Lines.findIndex((line) => validALine(diff, line, id));
      ae = findLastIndex(f1Lines, (line) => validALine(diff, line, id)) + 1;
      bs = f2Lines.findIndex((line) => validBLine(diff, line, id));
      be = findLastIndex(f2Lines, (line) => validBLine(diff, line, id)) + 1;
    } else {
      /**
       * 紧凑时按行号设定连线的端点
       */

      const { src_line, dest_line, block_length = 1 } = diff;

      as = f1Lines.findIndex((line) => line.number === src_line);
      ae = f1Lines.findIndex((line) => line.number === src_line + block_length - 1) + 1;
      bs = f2Lines.findIndex((line) => line.number === dest_line);
      be = f2Lines.findIndex((line) => line.number === dest_line + block_length - 1) + 1;

      switch (diff.mode) {
        // 删除脚本右侧只有一个点
        case "delete": {
          be = bs;
          break;
        }

        // 新增脚本左侧只有一个点
        case "insert": {
          ae = as;
          break;
        }

        // 拆分脚本左侧只有一行
        case "split": {
          ae = as + 1;
          break;
        }

        // 合并脚本右侧只有一行
        case "merge": {
          be = bs + 1;
          break;
        }
      }
    }

    linesMap.set(id, { mode: diff.mode, as, ae, bs, be }); // 注意 lineId 和 diffId 是对应的
  }

  return linesMap;
}
