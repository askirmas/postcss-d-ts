// TODO move to https://github.com/askirmas/ts-swiss
// <ts-swiss>
// type WithDefault<T, D> = {[K in keyof T]: K extends keyof D ? Exclude<T[K] | D[K], undefined> : T[K]}
export type Extend<T, N> = {
  [K in Exclude<keyof T, keyof N>]: T[K]
} & {
  [K in Exclude<keyof N, keyof T>]: N[K]
} & {
  [K in keyof N & keyof T]: T[K] | N[K]
}
export type Part<T> =  { [P in keyof T]?: T[P] }
type DefaultsAndExamples = {"default": any, "examples"?: any[]}
type SchemaWithDefaultsAndExamples = {"properties": Record<string, DefaultsAndExamples>}
export type SchemaDeclaredValues<T extends DefaultsAndExamples> = T["default"]
| (T["examples"] extends any[] ? Exclude<T["examples"], undefined>[number] : T["default"] )
// type EmptyObject = Record<never, never>

type DefaultsAndExamplesFromSchema<S extends SchemaWithDefaultsAndExamples> = {
  [K in keyof S["properties"]]
  : SchemaDeclaredValues<S["properties"][K]>
}
// </ts-swiss>

const {isArray: $isArray} = Array
, {keys: $keys} = Object

export {
  templating, 
  regexpize,
  extractDefaults
}

function templating(template: string, map: Record<string, string>) : string
function templating(template: string[], map: Record<string, string>) : string[]
function templating(template: string | string[], map: Record<string, string>) : string | string[] {
  const templates = $isArray(template) ? template : [template]
  , {length} = templates
  , output = new Array(length)

  for (let i = length; i--; ) {
    let result = templates[i]
    for (const word in map)
      // TODO check each and throw 'no option'
      result = result.replace(`\${${word}}`, map[word])  
    output[i] = result
  }
  return $isArray(template) ? output : output[0]
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