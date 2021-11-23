require("dotenv").config({ path: "./.env"});
const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  mode: "production",
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Simple crud api",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        MODE: JSON.stringify(process.env.MODE),
        PORT: JSON.stringify(process.env.PORT),
      },
    }),
  ],
};
