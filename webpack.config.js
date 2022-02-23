const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: {
    lipid: resolve(__dirname, 'src/lipid.ts'),
    lipidReactHookGenerator: resolve(__dirname, 'src/lipid-react-hook-generator.ts'),
  },
  output: {
    path: resolve(__dirname),
    filename: '[name].js',
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
