import schema from "./schema.json"
import { extractDefaults, regexpize } from "./utils";
import collector from "./collector";

const defaults = extractDefaults(schema)
, opts = {
  jsNotAllowed: new Set(defaults.jsIdentifierInvalidList),
  jsMatcher: regexpize(defaults.jsIdentifierPattern!),
  identifierParser: regexpize(defaults.identifierPattern, "g"),
  identifierMatchIndex: defaults.identifierMatchIndex,
  identifiers: new Set<string>()
}

it("demo", () => expect(collector(opts)({selectors: [
  ".class .class1 [id='.positive_mistake'] .ke-bab"
]})).toStrictEqual(new Set([
  "class1", "positive_mistake" 
])))
