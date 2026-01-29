import fs from "node:fs";
import path from "node:path";

interface IconFontConfig {
  id: string;
  name: string;
  font_family: string;
  css_prefix_text: string;
  description: string;
  glyphs: {
    icon_id: string;
    name: string;
    font_class: string;
    unicode: string;
    unicode_decimal: number;
  }[];
}

//读取配置
const data = fs.readFileSync(path.resolve("./src/icons/iconfont.json"), "utf8");
const config = JSON.parse(data) as IconFontConfig;

//模板构建
const template = (symbol: string) => {
  // language=tsx
  return `import { FC } from "react";
import Icon, { IconProps } from "@douyinfe/semi-icons";
import { IconFont } from "@icons/index.tsx";

export const Icon${symbol}: FC<Omit<IconProps, "svg">> = props => {
  return <Icon svg={<IconFont symbol={"${symbol}"} />} {...props} />;
};
`;
};

const templates = config.glyphs.map(x => ({
  name: `Icon${x.font_class}.tsx`,
  template: template(x.font_class),
}));

//写入
templates.forEach(x =>
  fs.writeFileSync(`./src/icons/${x.name}`, x.template, "utf-8"),
);

//将symbol的fill改成currentColor
const symbols = fs.readFileSync(
  path.resolve("./src/icons/iconfont.js"),
  "utf8",
);
fs.writeFileSync(
  "./src/icons/iconfont.js",
  symbols.replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="currentColor"'),
  "utf-8",
);
