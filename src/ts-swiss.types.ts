// TODO move to https://github.com/askirmas/ts-swiss

export type Picker<T, K extends string> = {[k in K]?: T extends {[_ in k]: infer V} ? V : undefined}

// type WithDefault<T, D> = {[K in keyof T]: K extends keyof D ? Exclude<T[K] | D[K], undefined> : T[K]}
export type Extend<T, N> = {
  [K in Exclude<keyof T, keyof N>]: T[K]
} & {
  [K in Exclude<keyof N, keyof T>]: N[K]
} & {
  [K in keyof N & keyof T]: T[K] | N[K]
}
export type Part<T> =  { [P in keyof T]?: T[P] }
type DefaultsAndExamples = {"default"?: unknown, "examples"?: unknown[]}
export type SchemaWithDefaultsAndExamples = {"properties": Record<string, DefaultsAndExamples>}
export type SchemaDeclaredValues<T extends DefaultsAndExamples> = T["default"]
| (
  T["examples"] extends any[]
  ? SchemaExampleToType<Extract<T["examples"], any[]>[number], "properties" extends keyof T ? true : false>
  : never
)
// type EmptyObject = Record<never, never>

type SchemaExampleToType<T, Strict extends boolean> = T extends Record<string, any>
? Strict extends true ? T : Record<string, T[keyof T]>
: T

export type DefaultsAndExamplesFromSchema<S extends SchemaWithDefaultsAndExamples> = {
  [K in keyof S["properties"]]
  : SchemaDeclaredValues<S["properties"][K]>
}
