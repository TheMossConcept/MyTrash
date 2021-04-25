module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  // TODO: Fix this stuff such that is always uses the @typescript-eslint rules!
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "import/extensions": "off",
    "react/prop-types": "off",
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};
