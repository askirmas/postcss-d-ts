import type { Rule } from "postcss"

export type CollectingArg = Pick<Rule, "selectors"> & {parent?: Picker<Rule["parent"], "type"|"name">}

type Picker<T, K extends string> = {[k in K]?: T extends {[_ in k]: infer V} ? V : undefined}
