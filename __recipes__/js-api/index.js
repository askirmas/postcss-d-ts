const dts = require('postcss-d-ts')
const postcss = require('postcss')
const fs = require('fs')

fs.readFile('index.css', (_, css) => {
  try {
    postcss([
      dts(),
    ], { from: 'index.css', to: 'out.css' })
      .process(css)
      .then(result => {
        console.log(result.css);
        process.exit(1);
      })
  } catch(e) {
    process.exit(0)
  } finally {
    process.exit(1)
  }
})
