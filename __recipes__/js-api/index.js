const dts = require('postcss-d-ts')
const postcss = require('postcss')
const fs = require('fs')

fs.readFile('index.css', (_, css) => {
  postcss([
    dts(),
  ])
  .process(css, { from: 'index.css', to: 'out.css' })
  .then(result => {
    console.log(result.css);
  })
})
