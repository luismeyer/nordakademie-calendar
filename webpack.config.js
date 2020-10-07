import path from "path";
import slsw from "serverless-webpack";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";

export const = {
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  mode: "development",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./resources/meetings.json", to: "./resources" }],
    }),
  ],
};
