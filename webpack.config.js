const path = require("path");
// require("babel-regster");
require("@babel/register");

// plugins
const htmlWebpackPlugin = require("html-webpack-plugin");
let faviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jp(e*)g|svg|bmp|ico)$/i,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8000,
            name: "images/[hash]-[name].[ext]"
          }
        }]
      },
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            removeComments: true,
            minimize: false
          }
        }]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: 'index.html',
      inject: "head",
      hash: true
    }),
    new faviconsWebpackPlugin({
      logo: "./assets/favicon/asterics-logo.png",
      prefix: 'assets/favicon/',
      // statsFilename: 'assets/iconstats.json',
      inject: true,
      background: '#ffffff',
      title: "WebACS",
      appDescription: 'AsTeRICS Configuration Suite',
      display: 'browser',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      }
    })
  ],
  mode: "production",
  // watch: true,
  devtool: "source-map",
};