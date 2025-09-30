import { useFilesStore } from "@/stores/files.ts";
import { useDiffSettingsStore } from "@/stores/diff-settings.ts";
import { i18n } from "@/utils/i18n/i18n.ts";
import { uploadFile, getDiffData } from "@/utils/requests.ts";
import { DIFF_SETTINGS } from "@/utils/storages/diff-settings.ts";

/**
 * 加载 diff 数据
 */
export async function diffGet(): Promise<DiffDataMap> {
  const { file1, file2 } = useFilesStore();
  const { getStoreValue } = useDiffSettingsStore();

  // 文件一致就没必要获取 diff 了
  if (file1.content === file2.content) {
    ElMessage.warning(i18n.global.t("diff_no_difference"));
    return Promise.resolve(new Map());
  }

  let k1, k2;
  try {
    k1 = await uploadFile(new File([file1.content], file1.name, { type: "text/plain" }));
  } catch (_e) {
    return Promise.reject();
  }
  try {
    k2 = await uploadFile(new File([file2.content], file2.name, { type: "text/plain" }));
  } catch (_e) {
    return Promise.reject();
  }

  let jsonData: Array<DiffDataItem>;
  try {
    jsonData = await getDiffData({
      c1: file1.content,
      c2: file2.content,
      k1: k1,
      k2: k2,
      settings: DIFF_SETTINGS.map((item) => [item.key, getStoreValue(item.key)]),
    });
  } catch (_e) {
    return Promise.reject();
  }

  /**
   * mdfy 处理控制台提交的脚本编辑
   */
  if (window.mdfy) {
    window.mdfy.execute(jsonData);
  }

  // index + 1 作为 diff_id（避免 id === 0 时的特殊情况判断）。前端在控制台预览 diff 数据时请自行 -1
  return Promise.resolve(new Map(jsonData.map((item, index) => [index + 1, item])));
}
