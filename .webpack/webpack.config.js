require("dotenv").config();
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "../src/server/simple-crud-api.js"),
  mode: "production",
  target: "node",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
};
