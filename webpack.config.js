/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    server: './src/server.ts',
    instrumentation: './src/instrumentation.ts',
  },
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.env*', to: '.' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        extensions: ['.ts', '.js'],
      }),
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
