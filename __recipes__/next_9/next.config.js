const withCss = require('@zeit/next-css')
, withSass = require('@zeit/next-sass')
, withLess = require('@zeit/next-less')
, withStylus = require('@zeit/next-stylus')

module.exports = withStylus(withLess(withSass(withCss({
  cssModules: true,
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  }
}))))