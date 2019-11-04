const postcssImports = require("postcss-import");
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  parser: "postcss",
  plugins: [
    postcssImports(),
    tailwindcss('tailwind.js'),
    purgecss({
      content: [
        './src/public/views/**/*.hbs'
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
    }),
    require('autoprefixer')
  ]
};


