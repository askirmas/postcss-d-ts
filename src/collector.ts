export default collector

function collector({
  identifiers,
  identifierParser,
  identifierMatchIndex,
}: {
  identifiers: Set<string>,
  identifierParser: RegExp,
  identifierMatchIndex: number,
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
        
        identifiers.add(identifier)
      }
    }

    return identifiers
  }
}

