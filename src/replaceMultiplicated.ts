export = replaceMultiplicated

function replaceMultiplicated(
  sources: string[],
  //TODO `searchValue: string[]` or `replacementMap`
  searchValue: string,
  replacements: string[]
) {
  const $return: (string|string[])[] = [...sources]
  , {length} = replacements

  for (let i = $return.length; i--;) {
    const line = sources[i]

    if (!line.includes(searchValue))
      continue

    const replaced: string[] = new Array(length)

    for (let j = length; j--;) {
      let next = line
      , pre: string

      //TODO Change to `.replaceAll` with common polyfill
      do {
        pre = next
        next = pre.replace(searchValue, replacements[j])
      } while (next !== pre)

      replaced[j] = next
    }

    $return[i] = replaced
  }

  //TODO Set up polyfill for `.flat()`
  return $return.flat()
}
