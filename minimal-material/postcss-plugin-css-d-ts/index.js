const postcss = require('postcss')
, {writeFile} = require('fs')
, {from: $from} = Array
, defaultOptions = {
  filePrefix: [
    "type StyleIds = {"
  ],
  filePostfix: [
    "}",
    "declare const styleIds: StyleIds",
    "export default styleIds"
  ],
  // TODO https://www.w3.org/TR/CSS21/syndata.html
  regex: /[\.#]([\w\d-]+)/g, 
  propertyType: "string|undefined", 
}

module.exports = postcss.plugin('postcss-plugin-css-d-ts', ({
  filePrefix, filePostfix, regex: reg,
  propertyType
} = defaultOptions) => {
  const pre = filePrefix.join("\n")
  , post = filePostfix.join("\n")
  , regex = typeof reg === "string"
  ? new RegExp(regex, "g")
  : reg

  return async (root, /*result*/) => {
    const {file} = root.source.input
    if (!file)
      return

    //TODO 1 file per all
    const declPath = `${file}.d.ts`
    , names = new Set()

    root.walkRules(({selectors}) => {
      //TODO consider postcss-selector-parser
      const {length} = selectors
      for (let i = length; i--; ) {
        const selector = selectors[i]
        
        while (match = regex.exec(selector))
          names.add(match[1])  
      }
    })

    const content = $from(names)
    , {length} = content

    for (let i = length; i--; ) {
      const className = content[i]
      content[i] = `  "${className}": ${propertyType}`
    }
    
    await new Promise((res, rej) =>
      //TODO any stream
      writeFile(
        declPath,
        `${
          pre
        }\n${
          content.join("\n")
        }\n${
          post
        }`,
        {},
        err => err ? rej(err) : res()
      )
    )
  }
})

