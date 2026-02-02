import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const plugin = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require default export and specific named exports in TSX files",
      category: "Best Practices",
      recommended: true,
    },
    schema: [], // no options
    messages: {
      missingDefault: "File must have a default export.",
      missingNamed: "File must export a constant '{{name}}'.",
    },
  },
  create: context => {
    const requiredExports = ["order", "text", "path", "icon"];
    let hasDefaultExport = false;
    const foundNamedExports = new Set();

    return {
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true;
      },
      ExportNamedDeclaration(node) {
        if (
          node.declaration &&
          node.declaration.type === "VariableDeclaration"
        ) {
          for (const decl of node.declaration.declarations) {
            if (decl.id && requiredExports.includes(decl.id.name)) {
              foundNamedExports.add(decl.id.name);
            }
          }
        }
      },
      "Program:exit"() {
        if (!hasDefaultExport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: "missingDefault",
          });
        }

        requiredExports.forEach(name => {
          if (!foundNamedExports.has(name)) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: "missingNamed",
              data: { name },
            });
          }
        });
      },
    };
  },
};

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": 0,
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/views/*/index.tsx"],
    plugins: {
      custom: {
        rules: {
          "datastudio-rules": plugin,
        },
      },
    },
    rules: {
      "custom/datastudio-rules": "error",
    },
  },
]);
