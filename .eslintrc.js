module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "prefer-template": ["error"],
    "no-useless-concat": ["error"],
    camelcase: ["error"],
    "no-duplicate-imports": ["error"],
    "import/newline-after-import": ["error"],
    "import/first": ["error"],
  },
};
