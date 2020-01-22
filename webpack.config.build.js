const { resolve } = require('path');

const config = {};

config.mode = 'production';
config.entry = resolve(__dirname, 'src/lipid.js');
config.output = {
  path: resolve(__dirname, 'build'),
  filename: 'index.js',
  library: 'lipid',
  libraryTarget: 'commonjs2',
};

config.module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
  ],
};

module.exports = config;