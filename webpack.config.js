const path = require('path');
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const Config = (entry, name, target, dest) => {
  return {
    entry,
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    mode: 'development',
    plugins: [
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'src', 'public', 'img', '**'),
        to: path.resolve(__dirname, 'dist', 'public', 'img'),
        flatten: true
      }]),
        new ImageminPlugin({
          pngquant: ({quality: [0.5, 0.5]}),
          plugins: [imageminMozjpeg({quality: 75})]
        })
    ],
    module: {
      rules: [
        {
          test: /\.js?/,
          exclude: /node_modules/,
          loader: ["babel-loader"]
        }
      ],
    },
    // resolve: {
    //   alias: {
    //     'handlebars': 'handlebars/dist/handlebars.min.js',
    //     'hbs': 'handlebars/dist/handlebars.min.js'
    //   }
    // },
    output: {
      path: dest,
      filename: `${name}.js`,
      publicPath: '/'
    }
  }
}

const serverEntry = path.resolve(__dirname, "server.js");
const serverPath = path.resolve(__dirname, "dist");
const serverConfig = Config(serverEntry, "bundled_server", "node", serverPath);

module.exports = [serverConfig]
