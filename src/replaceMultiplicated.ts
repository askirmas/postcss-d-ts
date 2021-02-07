export default replaceMultiplicated

function replaceMultiplicated(
  sources: string[],
  searchValue: string,
  replacements: string[]
) {
  const $return: (string|string[])[] = sources.concat()
  , {length} = replacements 
  , searcher = new RegExp(searchValue, "g")

  for (let i = $return.length; i--;) {
    const line = sources[i]
    if (!line.includes(searchValue))
      continue
    
    const replaced: string[] = new Array(length)

    for (let j = length; j--;)
      //TODO Change to `.replaceAll` with polyfill
      replaced[j] = line.replace(searcher, replacements[j])
      

    $return[i] = replaced
  }

  //TODO Set up polyfill for `.flat()`
  return $return.flat()
}