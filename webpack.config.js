const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + "/src",
  entry: {
    content: "./assets/js/content.js",
    popup: "./assets/js/popup.js",
    background: "./assets/js/background.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./popup.html", to: "./popup.html" },
        { from: "./manifest.json", to: "./manifest.json" },
        { from: "./assets/css/*.css" },
        { from: "./assets/img", to: "./assets/img" },
      ],
    }),
  ],
};

module.exports = config;
