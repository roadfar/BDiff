import { isEqual, isPlainObject, pick } from "lodash";
import { i18n } from "@/utils/i18n/i18n.ts";

const ALERT_COLORS = {
  primary: {
    background: "#cfe2ff",
    color: "#0a58ca",
  },
  success: {
    background: "#d1e7dd",
    color: "#146c43",
  },
  danger: {
    background: "#f8d7da",
    color: "#b02a37",
  },
  warning: {
    background: "#fff3cd",
    color: "#997404",
  },
} as const;

const log = (type: keyof typeof ALERT_COLORS, msg: string) => {
  console.log(
    `%c>>> mdfy <<<%c ${msg}`,
    `background: ${ALERT_COLORS[type].background}; color: ${ALERT_COLORS[type].color};`,
    "color: black;",
  );
};
const t = i18n.global.t;

export class DiffModify {
  private map: Array<[Partial<DiffDataItem>, Partial<DiffDataItem>]>;

  constructor() {
    this.map = [];
  }

  add(od: Partial<DiffDataItem>, nd: Partial<DiffDataItem>) {
    if (!isPlainObject(od)) {
      log("danger", t("mdfy_first_parameter_error"));
      return;
    }
    if (!isPlainObject(nd)) {
      log("danger", t("mdfy_second_parameter_error"));
      return;
    }
    this.map.push([od, nd]);
    log("success", t("mdfy_added_successfully", { button: t("btn_request_diff") }));
  }

  output(): void {
    log(
      "primary",
      this.map
        .map(([od, nd]) => `mdfy.add(${JSON.stringify(od)}, ${JSON.stringify(nd)});`)
        .join("\n"),
    );
  }

  clear(): void {
    this.map = [];
    log("warning", t("mdfy_cleared"));
  }

  execute(data: Array<DiffDataItem>): void {
    if (this.map.length === 0) return;

    log("primary", t("mdfy_execute_start"));
    try {
      this.map.forEach(([od, nd]) => {
        const diff = data.find((item) => isEqual(pick(item, Object.keys(od)), od));
        if (diff) {
          const diffCache = JSON.stringify(diff);
          Object.assign(diff, nd);
          log(
            "success",
            t("mdfy_executed_item", {
              overwritten: `${diffCache} → ${JSON.stringify(nd)}`,
            }),
          );
        } else {
          log("warning", t("mdfy_executed_item_not_found", { diff: JSON.stringify(od) }));
        }
      });
    } catch (_e) {
      log("danger", t("mdfy_data_error"));
      this.clear();
    }
  }
}

declare global {
  interface Window {
    mdfy: DiffModify;
  }
}
