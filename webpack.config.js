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
        {
          from: '.yarn/unplugged/saslprep*/**/node_modules/saslprep/**',
          to: 'saslprep',
        },
        {
          from: '.yarn/unplugged/sparse-bitfield*/**/node_modules/sparse-bitfield/**',
          to: 'sparse-bitfield',
        },
        {
          from: '.yarn/unplugged/memory-pager*/**/node_modules/memory-pager/**',
          to: 'memory-pager',
        },
        { from: path.resolve(__dirname, 'keys'), to: 'keys' }
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
  externals: {
    saslprep: "require('saslprep')",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
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
