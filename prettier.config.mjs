/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  jsxSingleQuote: false,
  arrowParens: "avoid",
  endOfLine: "auto",
  plugins: ["prettier-plugin-tailwindcss"],
};
