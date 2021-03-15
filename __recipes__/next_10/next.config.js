// const withLess = require('@zeit/next-less')
// const withStylus = require('@zeit/next-stylus')
module.exports = {
  webpack: (config) => {
    config.resolve.symlinks = true
    return config
  }
}
