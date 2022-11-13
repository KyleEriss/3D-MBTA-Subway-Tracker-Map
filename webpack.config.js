const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require("dotenv-webpack");

const CONFIG = {
  mode: "development",

  entry: {
    app: "./src/app.js",
  },
  
  output: {
    filename: 'bundle.js'
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new Dotenv({
      path: "./.env",
      safe: true,
    }),
  ],
};

module.exports = CONFIG;
