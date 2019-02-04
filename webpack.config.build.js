const { resolve } = require('path');

const config = {};

config.mode = 'production';
config.entry = resolve(__dirname, 'src/simple-state.js');
config.output = {
  path: resolve(__dirname, 'build'),
  filename: 'index.js',
  library: 'comfy',
  libraryTarget: 'umd',
};

config.module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
    }
  ],
}

module.exports = config;