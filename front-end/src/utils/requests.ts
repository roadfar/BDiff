import { i18n } from "@/utils/i18n/i18n.ts";
import { type DiffSettingKey, type DiffSettingValue } from "@/utils/storages/diff-settings.ts";

/**
 * 获取 diff 结果
 */
export function getDiffData(params: {
  c1: string;
  c2: string;
  k1: string;
  k2: string;
  settings: Array<[DiffSettingKey, DiffSettingValue]>;
}): Promise<Array<DiffDataItem>> {
  const formData = new FormData();
  formData.append("src", params.k1);
  formData.append("dest", params.k2);
  formData.append("src_lines_list", params.c1);
  formData.append("dest_lines_list", params.c2);

  params.settings.forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 20000; // 20s 超时
    xhr.open("POST", import.meta.env.VITE_BASE_URL, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response).datas);
        } else {
          console.error(xhr.response);
          ElMessage.error(i18n.global.t("xhr_failed_to_get_diff"));
          reject();
        }
      }
    };
    xhr.send(formData);
  });
}

/**
 * 文件上传，返回 key
 */
export function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 20000; // 上传就多等一会儿吧
    xhr.open("POST", `${import.meta.env.VITE_BASE_URL}/upload`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response).filename);
        } else {
          try {
            const { error = "unknown" } = JSON.parse(xhr.response);
            ElMessage.error(i18n.global.t("xhr_failed_to_upload_file", { msg: error }));
          } catch (_e) {}
          reject();
        }
      }
    };
    xhr.send(formData);
  });
}

/**
 * 获取 GitHub files
 */
export function getGithubFiles(params: {
  owner: string;
  repo: string;
  installation_id: string;
  pr_number: string;
}): Promise<Array<GithubFilesItem>> {
  const formData = new FormData();
  formData.append("owner", params.owner);
  formData.append("repo", params.repo);
  formData.append("installation_id", params.installation_id);
  formData.append("pr_number", params.pr_number);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 30000; // 30s 超时
    xhr.open("POST", `${import.meta.env.VITE_BASE_URL}/files`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response).data);
        } else {
          console.error(xhr.response);
          ElMessage.error(i18n.global.t("xhr_failed_to_get_github_files"));
          reject();
        }
      }
    };
    xhr.send(formData);
  });
}

/**
 * 获取 GitHub files content
 */
export function getGithubFilesContents(params: {
  owner: string;
  repo: string;
  installation_id: string;
  pr_number: string;
  filename: string;
}): Promise<{ base_file: string; head_file: string }> {
  const formData = new FormData();
  formData.append("owner", params.owner);
  formData.append("repo", params.repo);
  formData.append("installation_id", params.installation_id);
  formData.append("pr_number", params.pr_number);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 30000; // 10s 超时
    xhr.open("POST", `${import.meta.env.VITE_BASE_URL}/files/${params.filename}`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          console.error(xhr.response);
          ElMessage.error(i18n.global.t("xhr_failed_to_get_github_files_contents"));
          reject();
        }
      }
    };
    xhr.send(formData);
  });
}
