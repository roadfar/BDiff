/*
Copyright (c) [2025] [**]
BDiff is licensed under Mulan PubL v2.
You can use this software according to the terms and conditions of the Mulan PubL v2.
You may obtain a copy of Mulan PubL v2 at:
         http://openworks.mulanos.cn/#/licenses/MulanPubL-v2
THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
See the Mulan PubL v2 for more details.
*/

declare interface StoreFile {
  content: string;
  name: string;
}

declare type DiffMode =
  | "delete"
  | "insert"
  | "move"
  | "copy"
  | "update"
  | "m_update"
  | "c_update"
  | "split"
  | "merge";

// 更新的下标范围，[start, end]。为空时代表只有另一边有多的内容
declare type UpdateRange = [number, number] | [];

// 更新的行号对应，[src, dest]
declare type UpdateLines = [number, number];

declare interface DiffDataItem {
  mode: DiffMode;
  src_line: number;
  dest_line: number;

  // 连续行数
  block_length?: number;

  // 发生变更的下标范围（mode=update特有)
  str_diff?: [Array<UpdateRange>, Array<UpdateRange>];

  // 发生修改的行（mode=copy特有）
  updates?: Array<UpdateLines>;

  // 缩进
  indent_offset?: number;

  // 描述文本
  edit_action: string;

  // 平移/向上/向下移动
  move_type?: "h" | "u" | "d";
}

declare type DiffDataId = number;

declare type DiffDataMap = Map<DiffDataId, DiffDataItem>;

declare type ContentLinesItemBelong = "src" | "dest";

declare interface ContentLinesItem {
  // 这行内容来源于哪边
  belong: ContentLinesItemBelong;

  // 行内容，可能是富文本
  content: string;

  // 每行内容可能对应多个差异的id
  ids: Array<DiffDataId>;

  // 行号，null 代表空行
  number: number | null;

  // 对齐后，需要对同一块内容写入差异id（block_length > 1 时可能中间被插入空行），用于连续显示差异背景色
  block_ids: Array<DiffDataId>;
}

declare interface DiffLinesItem {
  mode: DiffMode;

  // 连线的左上端点
  as: number;

  // 连线的左下端点
  ae: number;

  // 连线的右上端点
  bs: number;

  // 连线的右下端点
  be: number;
}

declare type DiffLinesMap = Map<DiffDataId, DiffLinesItem>;

declare type PageMode = "normal" | "local" | "github";

declare type Theme = "light" | "dark";

declare interface GithubFilesItem {
  filename: string;
  status: "modified" | string; // modified 是修改文件名
}

declare interface Window {
  content1?: string;
  content2?: string;
  filename1?: string;
  filename2?: string;
  diffJson?: Array<DiffDataItem>;
}
