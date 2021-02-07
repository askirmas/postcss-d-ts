import { extractDefaults, templating } from "./utils";

describe(extractDefaults.name, () => {
  it("demo", () => expect(extractDefaults({
    "properties": {
      "default": {
        "default": "default"
      },
      //@ts-expect-error
      "examples": {
        "examples": [
          "example1",
          "example2"
        ]
      },
      "default and examples": {
        "default": "default",
        "examples": [
          "example1",
          "example2"
        ]
      },
      //@ts-expect-error
      "empty": {}
    }
  })).toStrictEqual({
    "default": "default",
    "examples": undefined,
    "default and examples": "default",
    "empty": undefined
  }))
})

describe(templating.name, () => {
  it("array", () => expect(templating(
    [
      "${x} + ${y}",
      "${x} * ${y}"
    ],
    {
      "x": "A",
      "y": "B",
    }
  )).toStrictEqual([
    "A + B",
    "A * B"
  ]))

  it("string", () => expect(templating(
    "${x} + ${y}",
    {
      "x": "A",
      "y": "B",
    }
  )).toStrictEqual(
    "A + B"
  ))
})