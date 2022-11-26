const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const CONFIG = {
  mode: "development",

  entry: {
    app: "./src/app.js",
  },
  
  output: {
    filename: 'app.js',
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
  },

  plugins: [
    new Dotenv({
      path: "./.env",
      safe: true,
    }),
  ],
};

module.exports = CONFIG;
