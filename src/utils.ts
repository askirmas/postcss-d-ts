const {isArray: $isArray} = Array

export {
  templating, regexpize
}

function templating(template: string, map: Record<string, string>) : string
function templating(template: string[], map: Record<string, string>) : string[]
function templating(template: string | string[], map: Record<string, string>) : string | string[] {
  const templates = $isArray(template) ? template : [template]
  , {length} = templates
  , output = new Array(length)

  for (let i = length; i--; ) {
    let result = templates[i]
    for (const word in map)
      result = result.replace(`\${${word}}`, map[word])  
    output[i] = result
  }
  return $isArray(template) ? output : output[0]
}

function regexpize(source: string|RegExp, flags = "") {
  return typeof source === "string"
  ? new RegExp(source, flags)
  : source
}