import type { SchemaDeclaredValues, Part, Replace } from './ts-swiss.types'
import schema = require("./schema.json")

type SchemaOptions = typeof schema
type DefOptions = {
  [K in keyof SchemaOptions["properties"]]
  : SchemaDeclaredValues<SchemaOptions["properties"][K]>
}

export type Options = Part<Replace<DefOptions, {
  identifierPattern: string | RegExp
  identifierCleanupPattern: string | RegExp
  destination: false | Exclude<DefOptions["destination"], boolean>
}>>
