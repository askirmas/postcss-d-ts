const withCss = require('@zeit/next-css')
, withSass = require('@zeit/next-sass')
// module.exports = withCss({
//   cssModules: true,
//   webpack: (config) => {
//     config.resolve.symlinks = false
//     return config
//   }
// })

module.exports = withSass(withCss({
  cssModules: true,
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  }
}))