import postcss from 'postcss'
import {createWriteStream} from 'fs'
import { regexpize, templating } from './utils'
import schema from "../schema.json"

type SchemaOptions = typeof schema
type DefOptions = {
  [K in keyof SchemaOptions["properties"]]
  : SchemaDeclaredValues<SchemaOptions["properties"][K]>
}
type jsOptions = {
  identifierParser: RegExp
  memberMatcher: RegExp
  destination: Record<string, string[]>
}

const {entries: $entries, fromEntries: $fromEntries} = Object
, defaultOptions = $fromEntries(
  $entries(schema.properties)
  .map(([key, {"default": $def}]) => [key, $def])
) as DefOptions

export type PostCssPluginDTsOptions = Part<Extend<DefOptions, jsOptions>>

export default postcss.plugin<PostCssPluginDTsOptions>('postcss-plugin-css-d-ts', (opts?: PostCssPluginDTsOptions) => {  
  const {
    declarationPrefix,
    declarationPostfix,
    identifierParser: ip,
    memberMatcher: mm,
    identifierMatchIndex,
    destination,
    internalSchema,
    memberSchema,
    type,
    memberInvalid
  } = {...defaultOptions, ...opts} // WithDefault<Options, DefOptions>
  , identifierParser = regexpize(ip, "g")
  , memberMatcher = mm && regexpize(mm)
  , notAllowedMember = new Set(memberInvalid)

  return async (root, result) => {
    const {file} = root.source?.input ?? {}
    if (!file)
    // TODO To common place
      return

    const oFile = {file}
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
          if (
            memberMatcher
            && !notAllowedMember.has(identifier)
            && memberMatcher.test(identifier)
          )
            members.push(templating(memberSchema, voc))
        }
      }
    })
   
    const blocks = [
      templating(declarationPrefix, oFile),
      properties,
      templating(declarationPostfix, oFile),
      members
    ]
    , {length} = blocks

    if (!destination) {
      result.warn("Destination is falsy")
    } else if (typeof destination === "string") {

      const stream = createWriteStream(templating(destination, oFile))
      
      await new Promise((res, rej) => {

        stream.on('error', rej).on('finish', res)

        for (let i = 0; i < length; i++) {
          const block = blocks[i]
          , {length: blockLength} = block
          for (let l = 0; l < blockLength; l++)
            stream.write(
              `${block[l]}\n`,
              err => err && rej(err)
            )
        }

        stream.end()
      }) 
    } else
      // TODO Somehow get rid of `{}`
      (destination as jsOptions["destination"])[
        templating(destination as string, oFile)
      ] = blocks.flat()
  }
})
