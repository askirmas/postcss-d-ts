import schema = require("./schema.json")
import { extractDefaults, regexpize } from "./utils";
import collector = require("./collector");

const defaults = extractDefaults(schema)
, opts = {
  identifierParser: regexpize(defaults.identifierPattern, "g"),
  identifierMatchIndex: defaults.identifierMatchIndex,
  identifiers: {}
}

it("demo", () => expect(Object.keys(
  collector(opts)({
    selectors: [".class [id='.positive_mistake'] .ke-bab"]
  })
)).toStrictEqual([
  "class", "positive_mistake", "ke-bab"
]))

// TAILWIND: Lost
// .group-hover\:bg-pink-200 
// .\32xl\:container

// MATERIAL
// digits?
