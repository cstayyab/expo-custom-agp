import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    plugins: {
      prettier,
    },
    languageOptions: {
      globals: {
        ...js.configs.recommended.languageOptions?.globals || {},
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
