import replaceMultiplicated from "./replaceMultiplicated"

describe(replaceMultiplicated.name, () => {
  it("single", () => expect(replaceMultiplicated(
    ["__id__: string // __id__"],
    "__id__",
    ["$id"]
  )).toStrictEqual([
    "$id: string // $id"
  ])),

  it("demo", () => expect(replaceMultiplicated(
    [
      "export default {",
      "  __id__: string;",
      "}",
      "export const __id__: string",
    ],
    "__id__",
    ["class1", "class2"]
  )).toStrictEqual([
    "export default {",
    "  class1: string;",
    "  class2: string;",
    "}",
    "export const class1: string",
    "export const class2: string",
  ]))
})