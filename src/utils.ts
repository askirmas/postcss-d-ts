import {readFileSync, unlink, exists} from "fs"
import {promisify} from "util"
import type { SchemaWithDefaultsAndExamples, DefaultsAndExamplesFromSchema } from "./ts-swiss.types"

const {keys: $keys} = Object
, $exists = promisify(exists)
, _unlink = promisify(unlink)

export {
  regexpize,
  extractDefaults,
  readlineSync,
  $exists,
  $unlink
}

function regexpize(source: string|RegExp, flags = "") {
  return typeof source === "string"
  ? new RegExp(source, flags)
  : source
}

function extractDefaults<S extends SchemaWithDefaultsAndExamples>({properties}: S) {
  const keys: Array<keyof typeof properties> = $keys(properties)
  , {length} = keys
  , defaults: Partial<DefaultsAndExamplesFromSchema<S>> = {}

  for (let i = length; i--; ) {
    const key = keys[i]
    //@ts-ignore
    defaults[key] = properties[key].default
  }

  return defaults as DefaultsAndExamplesFromSchema<S>
}

//TODO replace with common
function readlineSync(path: string, splitter: string) {
  return readFileSync(path).toString().split(splitter)
}

function $unlink(source: Parameters<typeof _unlink>[0]) {
  return $exists(source)
  .then(ex => ex ? _unlink(source) : void 0)
}
