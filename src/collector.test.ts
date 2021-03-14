import schema = require("./schema.json")
import { extractDefaults, regexpize } from "./utils";
import type {CollectingArg} from "./ts-swiss.types"
import collector = require("./collector");

const defaults = extractDefaults(schema)

function collectorCall(selectors: CollectingArg["selectors"], parent?: CollectingArg["parent"]) {
  return Object.keys(collector({
    identifiers: {},
    identifierParser: regexpize(defaults.identifierPattern, "g"),
    identifierMatchIndex: defaults.identifierMatchIndex,
    identifierCleanupParser: regexpize(defaults.identifierCleanupSearch, "g"),
    identifierCleanupReplace: defaults.identifierCleanupReplace,
    allowedAtRules: new Set(defaults.allowedAtRules)  
  })({
    selectors: selectors.reverse(),
    ...parent && {parent}
  }))
}

it("demo", () => expect(collectorCall([
  ".class [id='.positive_mistake'] .ke-bab"
])).toStrictEqual([
  "class", "positive_mistake", "ke-bab"
]))

it("tailwind", () => expect(collectorCall([
  ".group-hover\\:bg-pink-200",
  ".w-0\\.5",
  ".w-1\\/2",
  '.\\32xl',
  '.\\32xl\\:container',
])).toStrictEqual([
  "group-hover:bg-pink-200",
  "w-0.5",
  "w-1/2",
  "2xl",
  "2xl:container",
]))

describe("at-rule", () => {
  /** Appears in material
   * ```css
   * @-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
   *   0%, 68.2% {}
   * } */  
  it("without keyframes", () => expect(collectorCall(
    ['0%', '68.2%'],
    {"type": "atrule", "name": "keyframes"}
  )).toStrictEqual([
  ]))
  
  it("with media", () => expect(collectorCall(
    ['.inside-media'],
    {"type": "atrule", "name": "media"}
  )).toStrictEqual([
    "inside-media"
  ]))
})