const postcssImports = require("postcss-import");
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

console.log(
  `
    From postcss.config.js, ENV:
    ${process.env.NODE_ENV}
  `
)

const purgePlugin = process.env.NODE_ENV === 'production' 
  && purgecss({
    content: [ './src/public/views/**/*.hbs' ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  })

module.exports = {
  parser: "postcss",
  plugins: [
    postcssImports(),
    require('autoprefixer'),
    tailwindcss('tailwind.js'),
    purgePlugin
  ]
};


