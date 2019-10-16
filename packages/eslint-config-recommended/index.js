module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "security",
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:security/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "no-console": "off",
    "quotes": [
      "error",
      "single"
    ],
    "keyword-spacing": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": "error",
    "semi": [
      "error",
      "always"
    ],
    "eol-last": [
      "error",
      "always"
    ],
    "quote-props": [
      "error",
      "as-needed"
    ],
    "object-property-newline": [
      "error"
    ],
    "@typescript-eslint/indent": [
      "error",
      2
    ],
    "camelcase": "off",
    "@typescript-eslint/camelcase": [
      "error",
      {
        "properties": "never"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-member-accessibility": "off"
  }
};
