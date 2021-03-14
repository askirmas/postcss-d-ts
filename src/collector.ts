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

      // TODO check that parser is moving
      while (parsed = identifierParser.exec(selector)) {
        const identifier = parsed[identifierMatchIndex]
        .replace(identifierCleanupParser, identifierCleanupReplace)

        identifiers[identifier] = true
      }
    }
  }
}

