import path from "path";
// @ts-expect-error ts-migrate(2395) FIXME: Individual declarations in merged declaration 'sls... Remove this comment to see the full error message
import slsw from "serverless-webpack";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/webpack-node-externals` if... Remove this comment to see the full error message
import nodeExternals from "webpack-node-externals";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/copy-webpack-plugin` if it... Remove this comment to see the full error message
import CopyWebpackPlugin from "copy-webpack-plugin";

export const = {
  // @ts-expect-error ts-migrate(2395) FIXME: Individual declarations in merged declaration 'sls... Remove this comment to see the full error message
  entry: slsw.lib.entries,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '(Missing)'... Remove this comment to see the full error message
  target: "node",
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'nodeExternals' implicitly has an ... Remove this comment to see the full error message
  externals: [nodeExternals()],
  // @ts-expect-error ts-migrate(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  mode: "development",
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'output'.
  output: {
    // @ts-expect-error ts-migrate(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'filename'. Did you mean '__filen... Remove this comment to see the full error message
    filename: "[name].js",
  },
  // @ts-expect-error ts-migrate(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./resources/meetings.json", to: "./resources" }],
    }),
  ],
};
