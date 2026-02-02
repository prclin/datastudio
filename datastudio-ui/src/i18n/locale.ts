import en_US from "@i18n/en_US.ts";
import zh_CN from "@i18n/zh_CN.ts";
import semi_en_US from "@douyinfe/semi-ui-19/lib/es/locale/source/en_US";
import semi_zh_CN from "@douyinfe/semi-ui-19/lib/es/locale/source/zh_CN";
export interface Locale extends Record<string, string> {
  code: string;
  top_search: string;
  top_recents: string;
  top_settings: string;
  top_logout: string;
  side_home: string;
  side_studio: string;
}

export const messages = {
  [zh_CN.code]: zh_CN,
  [en_US.code]: en_US,
};

export const semiMessages = {
  [semi_zh_CN.code]: semi_zh_CN,
  [semi_en_US.code]: semi_en_US,
};
