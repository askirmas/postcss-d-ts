import type { SchemaDeclaredValues, Part, Extend } from './ts-swiss.types'
import schema = require("./schema.json")

type SchemaOptions = typeof schema
type DefOptions = {
  [K in keyof SchemaOptions["properties"]]
  : SchemaDeclaredValues<SchemaOptions["properties"][K]>
}
type jsOptions = {
  identifierPattern: RegExp
}

export type Options = Part<Extend<DefOptions, jsOptions>>
