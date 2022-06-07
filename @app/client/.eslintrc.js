module.exports = {
  extends: [`${__dirname}/../../.eslintrc.js`, "@remix-run/eslint-config"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "import/no-unresolved": 0,
  },
};
