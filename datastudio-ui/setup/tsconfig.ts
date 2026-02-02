// 构造rspack和ts路径别名
import fs from "node:fs";
import path from "node:path";
import * as jsonc from "jsonc-parser";

const dirs = fs
  .readdirSync(path.resolve("./src"), { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(item => item.name);

export const rspackAlias = dirs
  .map(x => ({ [`@${x}`]: path.resolve(`./src/${x}`) }))
  .reduce((x, y) => ({ ...x, ...y }), { "@": path.resolve("./src") });

if (process.argv[2] == "setup-tsconfig") {
  const tsPaths = dirs
    .map(x => ({ [`@${x}/*`]: [`src/${x}/*`] }))
    .reduce((x, y) => ({ ...x, ...y }), { "@/*": ["src/*"] });
  //写入ts路径别名
  const tsconfigPath = "tsconfig.json";
  const content = fs.readFileSync(tsconfigPath, "utf-8");
  const edits = jsonc.modify(content, ["compilerOptions", "paths"], tsPaths, {
    formattingOptions: { insertSpaces: true, tabSize: 2 },
  });
  const edited = jsonc.applyEdits(content, edits);
  fs.writeFileSync(tsconfigPath, edited, "utf-8");
}
