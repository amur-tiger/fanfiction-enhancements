module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-typescript/base", "plugin:@typescript-eslint/recommended", "plugin:import/typescript", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  globals: {
    GM: "readonly",
    GM_addValueChangeListener: "readonly",
    GM_removeValueChangeListener: "readonly",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "render" }],
    camelcase: [
      "error",
      {
        allow: ["GM_addValueChangeListener", "GM_removeValueChangeListener"],
      },
    ],
    "class-methods-use-this": "off",
    "prettier/prettier": [
      "error",
      {},
      {
        usePrettierrc: true,
      },
    ],
    "import/extensions": ["error", "never"],
    "import/no-cycle": ["warn"], // todo remove line to make this an error
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    "no-unused-vars": "off",
  },
};
