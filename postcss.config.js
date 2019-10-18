const postcssImports = require("postcss-import");
const tailwindcss = require('tailwindcss');

module.exports = {
  parser: "postcss",
  plugins: [
    postcssImports(),
    require('autoprefixer'),
    tailwindcss('tailwind.js'),
  ]
};


