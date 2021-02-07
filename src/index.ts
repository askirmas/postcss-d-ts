import postcss from 'postcss'
import {promisify} from "util"
import {createReadStream, createWriteStream, exists, readFileSync} from 'fs'
import {createInterface} from 'readline'
import {resolve} from "path"
import { regexpize, extractDefaults } from './utils'
import schema from "./schema.json"
import { Options, jsOptions } from './options'
import replaceMultiplicated from './replaceMultiplicated'

const $exists = promisify(exists)
, defaultOptions = extractDefaults(schema)
, {eol} = defaultOptions
//TODO several keywords
, identifierKeyword = "__identifier__"
//TODO replace with common
, readlineSync = (path: string, splitter = eol) => readFileSync(path).toString().split(splitter)
, defaultTemplate = readlineSync(resolve(__dirname, "_css-template.d.ts"))

export = postcss.plugin<Options>('postcss-plugin-css-d-ts', (opts?: Options) => {  
  const {
    eol,
    "identifierPattern": cssP,
    "jsIdentifierPattern": jsP,
    identifierMatchIndex,
    destination,
    jsIdentifierInvalidList,
    "template": templatePath
  } = {...defaultOptions, ...opts}
  , identifierParser = regexpize(cssP, "g")
  , jsMatcher = jsP && regexpize(jsP)
  , jsNotAllowed = new Set(jsIdentifierInvalidList)
  //TODO check `templatePath === ""`
  , templateContent = typeof templatePath === "string"
  ? readlineSync(templatePath, eol)
  : defaultTemplate

  return async (root, result) => {
    if (!destination && destination !== false)
      return result.warn("Destination is falsy")
    //TODO check sticky
    if (!identifierParser.flags.includes('g'))
      return result.warn('identifierParser should have global flag')
    /* istanbul ignore next //TODO read postcss documentation */
    const {file} = root.source?.input ?? {}

    if (!file)
    // TODO To common file?
      return //result.warn("Source is falsy")

    const filename = `${file}.d.ts`
    , identifiers = new Set<string>()

    root.walkRules(({selectors}) => {
      //TODO consider postcss-selector-parser
      const {length} = selectors
      
      for (let i = length; i--; ) {
        const selector = selectors[i]
        
        let parsed: RegExpExecArray | null

        // TODO check that parser is moving
        while (parsed = identifierParser.exec(selector)) {
          const identifier = parsed[identifierMatchIndex]
          
          if (
            //TODO notAllowedMember = null
            !jsNotAllowed.has(identifier)
            && (
              !jsMatcher
              || jsMatcher.test(identifier)
            )
          )
            identifiers.add(identifier)
        }
      }
    })

    const lines = replaceMultiplicated(
      templateContent,
      identifierKeyword,
      [...identifiers]
    )
    , {length} = lines

    writing: if (destination === false) {
      if (await $exists(filename)) {
        const lineReader = createInterface(createReadStream(filename))

        let i = 0
        , isSame = true

        for await (const line of lineReader) 
          if (!(isSame = line === lines[i++]))
            break

          
        if (isSame) {
          if (lines[length - 1] === "")
            i++
          if (length === i)
            break writing
        }
      }

      const stream = createWriteStream(filename)
      
      await new Promise((res, rej) => {

        stream.on('error', rej).on('finish', res)

        for (let i = 0; i < length; i++)
          stream.write(
            `${i ? eol : ''}${lines[i]}`,
            /* istanbul ignore next */
            err => err && rej(err)
          )

        stream.end()
      }) 
    } else
      // TODO Somehow get rid of `{}`
      (destination as jsOptions["destination"])[
        file
      ] = lines
  }
})
