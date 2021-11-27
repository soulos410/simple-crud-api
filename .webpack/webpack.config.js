require("dotenv").config();
const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  mode: "production",
  target: "node",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
  externals: [nodeExternals()],
  externalsPresets: { node: true },
};
