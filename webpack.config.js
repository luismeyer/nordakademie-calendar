const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  mode: "development",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  plugins: [new CopyWebpackPlugin(["./resources"])],
};
