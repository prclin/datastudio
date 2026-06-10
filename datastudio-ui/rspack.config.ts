import { defineConfig } from "@rspack/cli";
import { CopyRspackPlugin, rspack, type SwcLoaderOptions } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import { rspackAlias } from "./setup/tsconfig.ts";

const isDev = process.env.NODE_ENV === "development";
// Target browsers, see: https://github.com/browserslist/browserslist
export const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

export default defineConfig({
  output: { publicPath: "/" },
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: "/" }],
    },
  },
  entry: {
    main: "./src/main.tsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    alias: rspackAlias,
  },
  module: {
    rules: [
      {
        test: /\.(css?|scss?)$/,
        use: ["postcss-loader"],
        type: "css",
      },
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.vsix$/,
        loader: "./setup/rspack.vsix.loader.ts",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        // 由于rspack fast refresh与web worker冲突,开发时排除monaco editor
        exclude: isDev ? [/@codingame\/monaco-vscode/] : undefined,
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
                    development: isDev,
                    refresh: isDev,
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
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    isDev ? new ReactRefreshRspackPlugin() : null,
    // new SemiRspackPlugin({
    //   cssLayer: true,
    //   theme: "@semi-bot/semi-theme-datastudio",
    // }),
    new CopyRspackPlugin({
      patterns: ["public"],
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});
