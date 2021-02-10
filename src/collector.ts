export default collector

function collector({
  identifiers,
  identifierParser,
  identifierMatchIndex,
  jsNotAllowed,
  jsMatcher
}: {
  identifiers: Set<string>,
  identifierParser: RegExp,
  identifierMatchIndex: number,
  jsNotAllowed: Set<string>,
  jsMatcher: "" | null | RegExp
}) {
  return ({selectors}: {selectors: string[]}) => {
    //TODO consider postcss-selector-parser
    const {length} = selectors
    
    for (let i = length; i--; ) {
      const selector = selectors[i]
      
      let parsed: RegExpExecArray | null
  
      // TODO check that parser is moving
      while (parsed = identifierParser.exec(selector)) {
        const identifier = parsed[identifierMatchIndex]
        
        if (
          //TODO notAllowedMember = null
          !jsNotAllowed.has(identifier)
          && (
            !jsMatcher
            || jsMatcher.test(identifier)
          )
        )
          identifiers.add(identifier)
      }
    }

    return identifiers
  }
}

