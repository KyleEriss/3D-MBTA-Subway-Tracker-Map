const path = require('path');
const webpack = require('webpack');
require('dotenv').config();
const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      'GoogleMapsAPIKey': process.env.GOOGLE_MAPS_API_KEY
    })
  ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = CONFIG;
