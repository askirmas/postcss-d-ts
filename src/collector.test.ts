import schema = require("./schema.json")
import { extractDefaults, regexpize } from "./utils";
import collector = require("./collector");

const defaults = extractDefaults(schema)

function collectorCall(selectors: string[]) {
  return Object.keys(collector({
    identifiers: {},
    identifierParser: regexpize(defaults.identifierPattern, "g"),
    identifierMatchIndex: defaults.identifierMatchIndex,
    identifierCleanupParser: regexpize(defaults.identifierCleanupSearch, "g"),
    identifierCleanupReplace: defaults.identifierCleanupReplace,  
  })({
    selectors: selectors.reverse()
  }))
}

it("demo", () => expect(collectorCall([
  ".class [id='.positive_mistake'] .ke-bab"
])).toStrictEqual([
  "class", "positive_mistake", "ke-bab"
]))

/** Appears in
 * ```css
 * @-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
 *   0%, 68.2% {}
 * }
*/
it("material10 postcss issue", () => expect(collectorCall([
  '0%',
  '68.2%'
])).toStrictEqual([
  "2"
]))

describe("tailwind", () => {
  it("TBD", () => expect(collectorCall([
    ".group-hover\\:bg-pink-200",
    ".w-0\\.5",
    ".w-1\\/2",
    '.\\32xl',
    '.\\32xl\\:container',
  ])).not.toStrictEqual([
    "group-hover:bg-pink-200",
    "w-0.5",
    "w-1/2",
    "2xl",
    "2xl:container",
  ]))

  it("cur", () => expect(collectorCall([
    ".group-hover\\:bg-pink-200",
    ".w-0\\.5",
    ".w-1\\/2",
    '.\\32xl',
    '.\\32xl\\:container',
  ])).toStrictEqual([
    "group-hover:bg-pink-200",
    "w-0.5",
    "w-1/2",
  ]))
})
