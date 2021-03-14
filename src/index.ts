import postcss = require('postcss')
import {resolve} from "path"
import { regexpize, extractDefaults, readlineSync } from './utils'
import schema = require("./schema.json")
import type { Options, jsOptions } from './options.types'
import replaceMultiplicated = require('./replaceMultiplicated')
import collector = require('./collector')
import rewrite = require('./rewrite')

const defaultOptions = extractDefaults(schema)
, defaultTemplate = readlineSync(resolve(__dirname, "_css-template.d.ts"), "\n")

export = postcss.plugin<Options>('postcss-plugin-css-d-ts', (opts?: Options) => {
  const {
    eol,
    //TODO several keywords?
    identifierKeyword,
    "identifierPattern": cssP,
    identifierMatchIndex,
    destination,
    "template": templatePath,
  } = {...defaultOptions, ...opts}
  , identifierParser = regexpize(cssP, "g")
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

    //TODO Replace with {} https://jsbench.me/q5km8xdgbb
    const identifiers = new Set<string>()

    //TODO replace with just opts and inherit
    root.walkRules(collector({
      identifiers,
      identifierParser,
      identifierMatchIndex,
    }))

    const lines = replaceMultiplicated(
      templateContent,
      identifierKeyword,
      [...identifiers]
      //TODO Change with option
      .sort()
    )

    if (destination === false)
      await rewrite(`${file}.d.ts`, lines, eol)
    else
      // TODO Somehow get rid of `{}`
      (destination as jsOptions["destination"])[
        file
      ] = lines
  }
})
