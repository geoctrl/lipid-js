const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'lipid.js',
    library: {
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
  externals: {
    react: 'react',
    rxjs: 'rxjs',
  },
};
