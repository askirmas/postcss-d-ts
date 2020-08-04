const postcss = require('postcss')
, {writeFile} = require('fs')
, {from: $from} = Array
, TypeName = "StyleIds"
, varName = "styleIds"
, defaultOptions = {
  filePrefix: [
    `type ${TypeName} = {`
  ],
  filePostfix: [
    "}",
    "",
    `declare const ${varName}: ${TypeName};`,
    "",
    `export default ${varName};`,
    ""
  ],
  // TODO https://www.w3.org/TR/CSS21/syndata.html
  regex: /[\.#]([\w\d-]+)/g, 
  regexMatchIndex: 1,
  validVar: /^[\w][\w\d]+$/,
  propertyType: "string|undefined", 
}

module.exports = postcss.plugin('postcss-plugin-css-d-ts', ({
  filePrefix, filePostfix, regex: reg, validVar, regexMatchIndex,
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
    , jsVars = []

    root.walkRules(({selectors}) => {
      //TODO consider postcss-selector-parser
      const {length} = selectors
      for (let i = length; i--; ) {
        const selector = selectors[i]
        
        while (match = regex.exec(selector)) {
          match = match[regexMatchIndex]
          if (names.has(match))
            continue
          names.add(match)  
          if (validVar.test(match))
            jsVars.push(match)
        }
      }
    })

    const classNames = $from(names)
    , vars = $from(jsVars)

    for (let i = classNames.length; i--; )
      classNames[i] = `  "${classNames[i]}": ${propertyType}`
    for (let i = vars.length; i--; )
      vars[i] = `export const ${vars[i]}: ${propertyType}`
    
    await new Promise((res, rej) =>
      //TODO any stream
      writeFile(
        declPath,
        `${
          pre
        }\n${
          classNames.join("\n")
        }\n${
          post
        }\n${
          vars.join("\n")
        }`,
        {},
        err => err ? rej(err) : res()
      )
    )
  }
})

