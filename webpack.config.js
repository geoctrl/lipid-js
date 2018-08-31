const { resolve } = require('path');

const config = {};

config.mode = 'development';

config.entry = resolve(__dirname, 'src/index.js');
config.output = {
  path: resolve(__dirname, 'src'),
  filename: 'bundle.js',
};

config.module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
          ],
        }
      }
    }
  ],
}

module.exports = config;