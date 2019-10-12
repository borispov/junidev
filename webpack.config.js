const path = require('path');

const Config = (entry, name, target, path) => {
  return {
    entry,
    target,
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js?/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/react"],
          },
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader"
        }
      ],
    },
    output: {
      path,
      filename: `${name}.js`,
      publicPath: '/'
    },
    // devServer: {
    //   contentBase: path.join(__dirname, 'dist'),
    //   compress: true,
    //   port: 9000
    // }
  }
}

const clientEntry = path.resolve(__dirname, "views", "app.js");
const clientPath = path.resolve(__dirname, "dist");
const clientConfig = Config(clientEntry, "app", "web", clientPath);

const serverEntry = path.resolve(__dirname, "server.js");
const serverPath = __dirname;
const serverConfig = Config(serverEntry, "bundled_server", "node", serverPath);

module.exports = [serverConfig, clientConfig]
