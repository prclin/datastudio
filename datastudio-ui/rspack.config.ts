import { defineConfig } from "@rspack/cli";
import { CopyRspackPlugin, rspack, type SwcLoaderOptions } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import { SemiRspackPlugin } from "@douyinfe/semi-rspack-plugin";
import { rspackAlias } from "./setup/tsconfig.ts";

const isDev = process.env.NODE_ENV === "development";
// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

export default defineConfig({
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
    new SemiRspackPlugin({
      cssLayer: true,
      // 定制主体暂时无效等待pr https://github.com/DouyinFE/semi-design/pull/3121合并后修复
      theme: "@semi-bot/semi-theme-datastudio",
    }),
    new CopyRspackPlugin({
      patterns: ["public"],
    }),
  ],
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
