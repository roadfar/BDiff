import { defineStore } from "pinia";
import { ref, toRaw } from "vue";
import { useFilesStore } from "@/stores/files.ts";
import { i18n } from "@/utils/i18n/i18n.ts";
import { diffGet } from "@/utils/diff/diff-get.ts";
import { highlightContent } from "@/utils/diff/diff-highlight.ts";
import { getFileLang } from "@/utils/functions.ts";
import {
  formatContentToContentLines,
  formatDiffDataIntoContentLines,
  formatContentLinesToAlign,
  fillBlankLines,
} from "@/utils/diff/content-lines.ts";
import { initDiffLinesMap } from "@/utils/diff/diff-lines.ts";
import { useDiffSidebarStore } from "@/stores/diff-sidebar.ts";
import { usePageStore } from "@/stores/page.ts";

export const useDiffStore = defineStore("diff", () => {
  const filesStore = useFilesStore();
  const diffSidebarStore = useDiffSidebarStore();

  /**
   * 是否对齐渲染
   */

  const diffAlign = ref<boolean>(true);

  function updateDiffAlign(state: boolean): void {
    diffAlign.value = state;
    run({ repaint: true }).then();
  }

  /**
   * 当前高亮的 diff_id
   */

  const activeDiffId = ref<DiffDataId | null>(null);

  function setActiveDiffId(id: DiffDataId | null): void {
    activeDiffId.value = id;
  }

  /**
   * 当前弹窗的 diff_id
   */

  const dialogDiffId = ref<DiffDataId | null>(null);

  function setDialogDiffId(id: DiffDataId | null): void {
    dialogDiffId.value = id;
  }

  /**
   * Diff 数据的获取与生成
   */

  const loading = ref<boolean>(false);
  const diffDataMap = ref<DiffDataMap>(new Map());
  const f1Lines = ref<Array<ContentLinesItem>>([]);
  const f2Lines = ref<Array<ContentLinesItem>>([]);
  const diffLinesMap = ref<DiffLinesMap>(new Map());

  function setLoading(state: boolean): void {
    loading.value = state;
  }

  function setDiffDataMap(data: DiffDataMap): void {
    diffDataMap.value = data;
  }

  async function run(options: { repaint?: boolean } = {}): Promise<void> {
    const { repaint = false } = options;

    const { file1, file2 } = filesStore;

    if (!file1.name || !file2.name) {
      ElMessage.warning(i18n.global.t("btn_select_file_required"));
      return;
    }

    setLoading(true);
    diffSidebarStore.setDrawerVisible(false);

    if (!repaint) {
      try {
        setDiffDataMap(await diffGet());
      } catch (_e) {
        setLoading(false);
        return;
      }
    }

    /**
     * 基础班 lines
     */

    f1Lines.value = formatContentToContentLines(
      highlightContent(file1.content, getFileLang(file1.name)),
      "src",
    );
    f2Lines.value = formatContentToContentLines(
      highlightContent(file2.content, getFileLang(file2.name)),
      "dest",
    );

    /**
     * diff 信息写入每行
     */

    const result1 = formatDiffDataIntoContentLines(
      toRaw(f1Lines.value),
      toRaw(f2Lines.value),
      toRaw(diffDataMap.value),
    );
    f1Lines.value = result1.lines1;
    f2Lines.value = result1.lines2;

    /**
     * 对齐/紧凑
     */

    if (diffAlign.value) {
      const result2 = formatContentLinesToAlign(
        toRaw(f1Lines.value),
        toRaw(f2Lines.value),
        toRaw(diffDataMap.value),
      );
      f1Lines.value = result2.lines1;
      f2Lines.value = result2.lines2;

      const result3 = fillBlankLines(
        toRaw(f1Lines.value),
        toRaw(f2Lines.value),
        toRaw(diffDataMap.value),
      );
      f1Lines.value = result3.lines1;
      f2Lines.value = result3.lines2;
    }

    /**
     * 连接线数据生成
     */

    diffLinesMap.value = initDiffLinesMap(
      toRaw(f1Lines.value),
      toRaw(f2Lines.value),
      toRaw(diffDataMap.value),
      { diffAlign: toRaw(diffAlign.value) },
    );

    setLoading(false);

    /**
     * 打开侧边栏
     */

    if (diffDataMap.value.size > 0) {
      diffSidebarStore.setDrawerVisible(true);
    }
  }

  /**
   * 清空 diff 数据，返回 readme 页面
   */
  function clearDiff() {
    if (loading.value) return;

    // 仅在网页使用、上传文件diff的情况下重置
    const pageStore = usePageStore();
    if (pageStore.mode === "normal") {
      diffSidebarStore.setDrawerVisible(false);
      filesStore.removeFile1();
      filesStore.removeFile2();
      f1Lines.value = [];
      f2Lines.value = [];
      diffDataMap.value.clear();
      setLoading(false);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return {
    loading,
    setLoading,
    diffDataMap,
    setDiffDataMap,
    diffAlign,
    updateDiffAlign,
    f1Lines,
    f2Lines,
    diffLinesMap,
    run,
    activeDiffId,
    setActiveDiffId,
    dialogDiffId,
    setDialogDiffId,
    clearDiff,
  };
});
