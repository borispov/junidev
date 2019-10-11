var path = require('path');

module.exports = {
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"],
  },
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
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
