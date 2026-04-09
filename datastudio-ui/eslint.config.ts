import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import { RuleDefinition } from "@eslint/core";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

const plugin: RuleDefinition = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require default export and specific named exports in TSX files",
      recommended: true,
    },
    schema: [], // no options
    messages: {
      missingDefault: "File must have a default export.",
      missingNamed: "File must export a constant '{{name}}'.",
    },
  },
  create: context => {
    const requiredExports = ["text", "icon"];
    let hasDefaultExport = false;
    const foundNamedExports = new Set();

    return {
      ExportDefaultDeclaration(_: TSESTree.ExportDefaultDeclaration) {
        hasDefaultExport = true;
      },
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            const id = decl.id as TSESTree.Identifier;
            if (id && requiredExports.includes(id.name))
              foundNamedExports.add(id.name);
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
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
  {
    files: ["src/views/**/index.tsx"],
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
