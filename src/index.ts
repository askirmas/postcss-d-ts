import postcss from 'postcss'
import {writeFile} from 'fs'
import { regexpize, templating } from './utils'
import defaultOptions from "./default.json"

type DefOptions = typeof defaultOptions
type jsOptions = {
  identifierParser: RegExp
  memberMatcher: RegExp
}
type Options = Extend<DefOptions, jsOptions>


module.exports = postcss.plugin<Options>('postcss-plugin-css-d-ts', ({
  declarationPrefix,
  declarationPostfix,
  identifierParser: ip,
  memberMatcher: mm,
  identifierMatchIndex,
  destination,
  internalSchema,
  membersSchema,
  type
}: WithDefault<Options, DefOptions> = defaultOptions) => {
  const identifierParser = regexpize(ip, "g")
  , memberMatcher = regexpize(mm)

  return async (root, /*result*/) => {
    const {file} = root.source?.input ?? {}
    if (!file)
    // TODO To common place
      return

    const oFile = {file}
    , declPath = templating(destination, oFile)
    , names = new Set<string>()
    , properties: string[] = []
    , members: string[] = []

    root.walkRules(({selectors}) => {
      //TODO consider postcss-selector-parser
      const {length} = selectors
      
      for (let i = length; i--; ) {
        const selector = selectors[i]
        
        let identifier

        while (identifier = identifierParser.exec(selector)) {
          identifier = identifier[identifierMatchIndex]
          if (names.has(identifier))
            continue
          
          const voc = {identifier, type}
          
          names.add(identifier)
          properties.push(templating(internalSchema, voc))
          if (memberMatcher.test(identifier))
            members.push(templating(membersSchema, voc))
        }
      }
    })
    
    await new Promise((res, rej) =>
      //TODO any stream
      writeFile(
        declPath,
        `${
          templating(declarationPrefix, oFile)
        }\n${
          properties.join("\n")
        }\n${
          templating(declarationPostfix, oFile)
        }\n${
          members.join("\n")
        }`,
        {},
        err => err ? rej(err) : res()
      )
    )
  }
})
