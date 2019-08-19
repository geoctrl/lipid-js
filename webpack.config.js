const path = require('path');

const config = {};

config.mode = 'development';

config.entry = path.resolve(__dirname, 'dev/index.js');
config.output = {
  path: path.resolve(__dirname, 'dev'),
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

config.devServer = {
  index: 'index.html',
  contentBase: path.resolve(__dirname, 'dev'),
  historyApiFallback: true,
  port: 8080,
};

module.exports = config;