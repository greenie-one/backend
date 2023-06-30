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
  mode: process.env.APP_ENV !== 'local' ? 'production' : 'development',
  target: 'node',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '.env*', to: '.' },
        {
          from: '.yarn/unplugged/is-core-module*/**/core.json',
          to: './core.json',
        },
      ],
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
    // alias: {
    //   'is-core-module': './is-core-module-mock.js',
    // },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
