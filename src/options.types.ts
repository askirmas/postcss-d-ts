import type { SchemaDeclaredValues, Part, Extend } from './utils'
import schema = require("./schema.json")

type SchemaOptions = typeof schema
type DefOptions = {
  [K in keyof SchemaOptions["properties"]]
  : SchemaDeclaredValues<SchemaOptions["properties"][K]>
}
export type jsOptions = {
  identifierPattern: RegExp
  destination: Record<string, string[]>
}

export type Options = Part<Extend<DefOptions, jsOptions>>
