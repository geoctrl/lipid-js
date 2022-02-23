const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, 'src/lipid.ts'),
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'index.js',
    library: {
      type: 'umd',
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
};
