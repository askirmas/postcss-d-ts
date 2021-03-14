import type { CollectingArg } from "./ts-swiss.types"

export = collector

function collector({
  identifiers,
  identifierParser,
  identifierMatchIndex,
  identifierCleanupParser,
  identifierCleanupReplace,
  allowedAtRules,
}: {
  identifiers: Record<string, true>,
  identifierParser: RegExp,
  identifierMatchIndex: number,
  identifierCleanupParser: RegExp,
  identifierCleanupReplace: string,
  allowedAtRules: Set<string>
}) {
  return ({selectors, parent}: CollectingArg) => {
    if (parent?.type === "atrule") {
      const {name} = parent
      //@ts-expect-error
      if (name && !allowedAtRules.has(name))
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

