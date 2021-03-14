import {readFileSync} from "fs"
import type { SchemaWithDefaultsAndExamples, DefaultsAndExamplesFromSchema } from "./ts-swiss.types"

const {keys: $keys} = Object

export {
  regexpize,
  extractDefaults,
  readlineSync
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
