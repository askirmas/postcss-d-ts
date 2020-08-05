import postcss from 'postcss'
import {promisify} from "util"
import {createReadStream, createWriteStream, exists} from 'fs'
import {createInterface} from 'readline'
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
, $exists = promisify(exists)
, defaultOptions = $fromEntries(
  $entries(schema.properties)
  .map(([key, {"default": $def}]) => [key, $def])
) as DefOptions

export type PostCssPluginDTsOptions = Part<Extend<DefOptions, jsOptions>>

export default postcss.plugin<PostCssPluginDTsOptions>('postcss-plugin-css-d-ts', (opts?: PostCssPluginDTsOptions) => {  
  const {
    crlf,
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
   
    const lines = [
      templating(declarationPrefix, oFile),
      properties,
      templating(declarationPostfix, oFile),
      members
    ].reduce((x, y) => x.concat(y) )
    , {length} = lines

    writing: if (!destination) {
      result.warn("Destination is falsy")
    } else if (typeof destination === "string") {

      const filename = templating(destination, oFile)
      if (await $exists(filename)) {
        const lineReader = createInterface(createReadStream(filename))

        let i = 0
        , isSame = true

        for await (const line of lineReader) 
          if (!(isSame = line === lines[i++]))
            break
        
        if (isSame && i === length)
          break writing
      }

      const stream = createWriteStream(filename)
      
      await new Promise((res, rej) => {

        stream.on('error', rej).on('finish', res)

        for (let i = 0; i < length; i++)
          stream.write(
            `${lines[i]}${crlf}`,
            err => err && rej(err)
          )

        stream.end()
      }) 
    } else
      // TODO Somehow get rid of `{}`
      (destination as jsOptions["destination"])[
        templating(destination as string, oFile)
      ] = lines
  }
})
