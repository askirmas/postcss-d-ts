import schema = require("./schema.json")
import { extractDefaults, regexpize } from "./utils";
import collector = require("./collector");

const defaults = extractDefaults(schema)
, opts = {
  identifierParser: regexpize(defaults.identifierPattern, "g"),
  identifierMatchIndex: defaults.identifierMatchIndex,
  identifiers: new Set<string>()
}

it("demo", () => expect(collector(opts)({selectors: [
  ".class [id='.positive_mistake'] .ke-bab"
]})).toStrictEqual(new Set([
  "class", "positive_mistake", "ke-bab"
])))
