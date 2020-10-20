const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/, /.test.ts/],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "node",
  externals: [nodeExternals()],
  mode: "development",
  devtool: "inline-source-map",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./resources/*.json" },
        { from: "./resources/*.html" },
      ],
    }),
  ],
};
