/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
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
    ]
  }
};

const nodeBundle = {
  ...baseConfig,
  output: {
    filename: 'index.node.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs'
    },
  },
  target: 'node',
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      allowlist: ['node-fetch']
    })
  ],
};

const browserBundle = {
  ...baseConfig,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs'
    },
  },
};

module.exports = [
  nodeBundle,
  browserBundle
];
