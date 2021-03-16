import type { CollectingArg, InternalOptions } from "./$defs.types"
import type { Options } from "./options.types"

export = collector

function collector(
  identifiers: Record<string, true>,
  {
    identifierParser,
    identifierMatchIndex,
    identifierCleanupParser,
    identifierCleanupReplace,
    allowedAtRuleNames,
  }: Pick<Required<Options>, "identifierMatchIndex"|"identifierCleanupReplace">
  & Pick<InternalOptions, "identifierParser"|"identifierCleanupParser"|"allowedAtRuleNames">
) {
  return ({selectors, parent}: CollectingArg) => {
    if (parent?.type === "atrule") {
      const {name} = parent

      if (name && !allowedAtRuleNames.has(name))
        return
    }

    //TODO consider postcss-selector-parser
    const {length} = selectors

    for (let i = length; i--; ) {
      const selector = selectors[i]

      let parsed: RegExpExecArray | null
      let lastIndex: number|undefined = undefined

      while (parsed = identifierParser.exec(selector)) {
        const {index} = parsed
        if (index === lastIndex)
          // TODO consider throw error
          return

        lastIndex = index
        const identifier = parsed[identifierMatchIndex]
        .replace(identifierCleanupParser, identifierCleanupReplace)

        identifiers[identifier] = true
      }
    }
  }
}

