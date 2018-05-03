var webpack = require('webpack');
var path = require('path');

// var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
// var APP_DIR = path.resolve(__dirname, 'src/client/app');
var BUILD_DIR = path.resolve(__dirname, 'datalake/static/scripts/public');
var APP_DIR = path.resolve(__dirname, 'datalake/static/scripts/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;