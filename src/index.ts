import {resolve} from "path"
import { regexpize, extractDefaults, readlineSync } from './utils'
import schema = require("./schema.json")
import type { Options } from './options.types'
import replaceMultiplicated = require('./replaceMultiplicated')
import collector = require('./collector')
import rewrite = require('./rewrite')
import type { InternalOptions, WithSource } from './$defs.types'

type Opts = Required<Options>

const {keys: $keys} = Object
, defaultOptions = extractDefaults(schema) as Opts
, {
  title,
  signature,
  templateEol,
  properties: {template: {$comment: templatePath}}
} = schema
, defaultTemplate = readlineSync(resolve(__dirname, templatePath), templateEol)

const creator8 = (opts?: Options) => {
  const options = makeOpts(opts)

  return {
    postcssPlugin: title,
    prepare: (result: {
      warn: (arg: string) => any
      root: WithSource
    }) => {
      //TODO #12 template update check

      /* istanbul ignore next `source === undefined` for manually created node with `.decl` */
      if (!result.root?.source?.input.file)
        return {}

      try {
        optsCheck(options)
      } catch ({message}) {
        // TODO throw error
        result.warn(message)
        return {}
      }

      // https://jsbench.me/q5km8xdgbb
      const identifiers: Record<string, true> = {}

      return {
        RuleExit: collector(identifiers, options),
        RootExit: writer(identifiers, options)
      }
    }
  } //as Plugin
}

creator8.postcss = true

export = creator8

function optsCheck({
  destination,
  identifierParser
}: {destination: any} & Pick<InternalOptions, "identifierParser">) {
  if (!(destination === false || destination !== null && typeof destination === "object"))
    throw Error("Destination is of wrong type")

  //TODO check sticky
  if (!identifierParser.flags.includes('g'))
    throw Error('identifierParser should have global flag')
}

function makeOpts(opts?: Options) {
  const options = !opts ? defaultOptions : {...defaultOptions, ...opts}
  , {
    eol,
    destination,
    //TODO several keywords?
    identifierKeyword,
    identifierMatchIndex,
    identifierCleanupReplace,
  } = options

  return {
    eol,
    destination,
    identifierKeyword,
    identifierMatchIndex,
    identifierCleanupReplace,
    ...internalOpts(options)
  }
}

function internalOpts({
  eol,
  template: templatePath,
  identifierPattern: cssP,
  identifierCleanupPattern: escapedP,
  allowedAtRules: atRules,
  checkMode
}: Pick<Opts, "eol"|"template"|"identifierPattern"|"identifierCleanupPattern"|"allowedAtRules"|"checkMode">): InternalOptions {
  const identifierParser = regexpize(cssP, "g")
  , identifierCleanupParser = regexpize(escapedP, "g")
  //TODO check `templatePath === ""`
  , templateContent = typeof templatePath === "string"
  // TODO not sync
  ? readlineSync(templatePath, eol)
  : defaultTemplate

  , allowedAtRuleNames = new Set(atRules)

  return {
    identifierParser,
    identifierCleanupParser,
    templateContent,
    allowedAtRuleNames,
    checkMode: checkMode ?? process.env.NODE_ENV === "production"
  }
}

function writer(
  identifiers: Record<string, any>,
  {
    eol,
    templateContent,
    identifierKeyword,
    destination,
    checkMode
  }: Pick<Opts, "eol"|"identifierKeyword"|"destination">
  & Pick<InternalOptions, "templateContent"|"checkMode">
) {
  return (async ({source}: WithSource) => {
    const file = source!.input.file!
    , lines = replaceMultiplicated(
      signature.concat(templateContent),
      identifierKeyword,
      $keys(identifiers)
      //TODO Change with option
      .sort()
    )

    if (destination === false)
      await rewrite(`${file}.d.ts`, lines, eol, checkMode)
    else
      destination[file] = lines
  })
}
