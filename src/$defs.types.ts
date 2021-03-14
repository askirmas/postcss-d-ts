import type { Rule } from "postcss"
import type { Picker } from "./ts-swiss.types"

export type CollectingArg = Pick<Rule, "selectors"> & {parent?: Picker<Rule["parent"], "type"|"name">}

export type InternalOptions = {
  identifierParser: RegExp;
  identifierCleanupParser: RegExp;
  templateContent: string[];
  allowedAtRuleNames: Set<string>;
}
