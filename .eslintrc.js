module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:react/recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  "rules": {
    "no-console": "warn",
    "no-debugger": "warn",
    "linebreak-style": "off",
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline"
    }],
    "space-before-function-paren": [
      "error",
      "always"
    ],
    "space-before-blocks": [
      "error",
      "always"
    ],
    "keyword-spacing": ["error"],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "arrow-spacing": ["error"],
    "comma-spacing": ["error"],
    "space-infix-ops": ["error"],
    "max-len": [
      "warn",
      {
        "code": 180,
        "ignoreUrls": true
      }
    ],
    "template-curly-spacing": "off",
    "indent": [
      "warn",
      2,
      {
        "MemberExpression": "off",
        "ignoredNodes": ["TemplateLiteral"],
        "SwitchCase": 1
      }
    ]
  }
}
