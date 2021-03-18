import type {DefaultsAndExamplesFromSchema, SchemaWithDefaultsAndExamples} from "./ts-swiss.types"

const {keys: $keys} = Object
, {random: $random} = Math

export {
  regexpize,
  extractDefaults,
  randomString
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

  for (let i = length; i--;) {
    const key = keys[i]
    //@ts-ignore

    defaults[key] = properties[key].default
  }

  return defaults as DefaultsAndExamplesFromSchema<S>
}

function randomString() {
  return $random().toString(36)
  .slice(2)
}
