const { resolve } = require('path');

const config = {};

config.mode = 'development';

config.entry = resolve(__dirname, 'dev/index.js');
config.output = {
  path: resolve(__dirname, 'dev'),
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
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-syntax-decorators', {
              legacy: true,
            }]
          ],
        }
      }
    }
  ],
}

module.exports = config;