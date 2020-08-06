const withCss = require('@zeit/next-css')

console.log(
  Object.keys(process.env)
  .filter(name => name.startsWith('npm_config_'))
)

// module.exports = withCss({
//   cssModules: false
// })