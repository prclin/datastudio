import { defineConfig } from "@rspack/cli";
import { resolve } from "node:path";
import type { SwcLoaderOptions } from "@rspack/core";
import { targets } from "../rspack.config";
// 由于monaco-languageclient的editor worker里包含浏览器不支持的module名，需要重新打包
export default defineConfig({
  devtool: false,
  mode: "production",
  entry: {
    "editor.worker":
      "./node_modules/@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js",
    "search.worker":
      "./node_modules/@codingame/monaco-vscode-search-service-override/worker.js",
    "textmate.worker":
      "./node_modules/@codingame/monaco-vscode-textmate-service-override/worker.js",
    "notebook.worker":
      "./node_modules/@codingame/monaco-vscode-notebook-service-override/worker.js",
    "extension.worker":
      "./node_modules/@codingame/monaco-vscode-api/workers/extensionHost.worker.js",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "../src/workers"),
    chunkLoading: false,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
              },
              env: { targets },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
});
