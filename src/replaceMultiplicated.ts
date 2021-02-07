export default replaceMultiplicated

function replaceMultiplicated(
  sources: string[],
  searchValue: string,
  replacements: string[]
) {
  const $return: (string|string[])[] = sources.concat()
  , {length} = replacements 

  for (let i = $return.length; i--;) {
    const line = sources[i]
    if (!line.includes(searchValue))
      continue
    
    const replaced: string[] = new Array(length)

    for (let j = length; j--;)
      replaced[j] = line.replaceAll(searchValue, replacements[j])
      

    $return[i] = replaced
  }

  return $return.flat()
}