module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es))',
  ],
  collectCoverage: true,
};