// .eslintrc.js (CommonJS, compatible ESLint v8)
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 2022+ requis pour le await de premier niveau dans src/app.js
    sourceType: 'module',
  },
  rules: {
    // Ajoute ici tes règles personnalisées si besoin
  },
};