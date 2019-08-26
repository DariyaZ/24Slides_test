const path = require('path')

module.exports = {
  alias: {
    '@base': path.resolve(__dirname, '../'),
    '@scripts': path.resolve(__dirname, '../scripts'),
    '@styles': path.resolve(__dirname, '../styles'),
  },
  extensions: ['.js', '.jsx', '.json'],
  modules: ['node_modules', 'scripts', path.resolve(__dirname, '../scripts')],
}
