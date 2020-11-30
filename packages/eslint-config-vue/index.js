module.exports = {
    env: {
      node: true,
      jest: true,
      es6: true
    },
    parser: "vue-eslint-parser",
    extends: [
      "@faasjs/recommended",
      "plugin:vue/essential"
    ]
  };
