import schema = require("./schema.json")
import { extractDefaults, regexpize } from "./utils";
import collector = require("./collector");

const defaults = extractDefaults(schema)
, opts = {
  identifierParser: regexpize(defaults.identifierPattern, "g"),
  identifierMatchIndex: defaults.identifierMatchIndex,
}

it("demo", () => expect(Object.keys(
  collector({...opts, identifiers: {}})({
    selectors: [".class [id='.positive_mistake'] .ke-bab"]
  })
)).toStrictEqual([
  "class", "positive_mistake", "ke-bab"
]))

/** Appears in
 * ```css
 * @-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
 *   0%, 68.2% {}
 * }
*/
it("material10 postcss issue", () => expect(Object.keys(
  collector({...opts, identifiers: {}})({
    selectors: ['0%', '68.2%']
  })
)).toStrictEqual([
  "2"
]))

describe("tailwind", () => {
  it("TBD", () => expect(Object.keys(
    collector({...opts, identifiers: {}})({
      selectors: [
        ".group-hover\\:bg-pink-200",
        '.\\32xl',
        '.\\32xl\\:container',
        ".w-0\\.5",
        ".w-1\\/2"
      ]
    })
  )).not.toStrictEqual([
    "group-hover:bg-pink-200",
    "2xl",
    "2xl:container",
    "w-0.5",
    "w-1/2"
  ]))

  it("cur", () => expect(Object.keys(
    collector({...opts, identifiers: {}})({
      selectors: [
        ".group-hover\\:bg-pink-200",
        '.\\32xl',
        '.\\32xl\\:container',
        ".w-0\\.5",
        ".w-1\\/2"
      ]
    })
  )).toStrictEqual([
    "5",
    "w-1",
    "w-0",
    "group-hover"
  ]))
})
