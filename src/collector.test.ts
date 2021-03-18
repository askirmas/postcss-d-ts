import schema = require("./schema.json")
import {extractDefaults, regexpize} from "./utils"
import type {CollectingArg} from "./$defs.types"
import collector = require("./collector");

const defaults = extractDefaults(schema)

function collectorCall(selectors: CollectingArg["selectors"], parent?: CollectingArg["parent"], opts?: Partial<Parameters<typeof collector>[1]>) {
  const identifiers = {}

  collector(identifiers, {
    identifierParser: regexpize(defaults.identifierPattern, "g"),
    identifierMatchIndex: defaults.identifierMatchIndex,
    identifierCleanupParser: regexpize(defaults.identifierCleanupPattern, "g"),
    identifierCleanupReplace: defaults.identifierCleanupReplace,
    allowedAtRuleNames: new Set(defaults.allowedAtRules),
    ...opts
  })({
    selectors: selectors.reverse(),
    ...parent && {parent}
  })

  return Object.keys(identifiers)
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
  '.\\32xl\\:container'
])).toStrictEqual([
  "group-hover:bg-pink-200",
  "w-0.5",
  "w-1/2",
  "2xl",
  "2xl:container"
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

it("stuck parser", () => expect(collectorCall(
  [".class1 .class2"],
  undefined,
  {identifierParser: regexpize(defaults.identifierPattern)}
)).toStrictEqual([
  "class1"
]))
