const path = require('path');

module.exports = {
  entry: './src/plugin.ts',
  mode: "development",
  devtool: 'inline-source-map',
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig-lib.json" })
    ],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build/wp/lib'),
    clean: true
  }
};
