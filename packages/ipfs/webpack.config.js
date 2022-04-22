/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs'
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-typescript",
            ],
          },
        },
      },
      // {
      //   test: /\.ts?$/,
      //   use: {
      //     loader: 'ts-loader',
      //     options: {
      //       configFile: path.resolve(__dirname, './tsconfig-build.json'),
      //     }
      //   },
      //   exclude: /node_modules/,
      // },
    ]
  },
  externals: [
    nodeExternals({
      allowlist: ['node-fetch']
    })
  ],
};
