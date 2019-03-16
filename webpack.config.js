const path = require("path");
const webpack = require("webpack");

// require("babel-regster");
require("@babel/register");

// plugins
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
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
            // limit: 8000,
            limit: 1,
            // name: "images/[hash]-[name].[ext]"
            name: "view/images/[name].[ext]"
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
      inject: "body",
      hash: true
    }),
    new copyWebpackPlugin([
      { 
        from: 'assets/resources', 
        to: '.'
      }
    ]),
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
        appleStartup: false,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery"
    })
  ],
  // mode: "production",
  // watch: true,
  devtool: "source-map",
};