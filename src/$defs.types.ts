import type { Rule } from "postcss8"

export type CollectingArg = Pick<Rule, "selectors"> & {
  parent?: {type?: string, name?: string}
}

export type InternalOptions = {
  identifierParser: RegExp;
  identifierCleanupParser: RegExp;
  templateContent: string[];
  allowedAtRuleNames: Set<string>;
}

export type WithSource = {
  source?: {input: {file?: string}}
}
