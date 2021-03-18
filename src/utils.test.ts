import {extractDefaults, regexpize} from "./utils"

describe(extractDefaults.name, () => {
  it("demo", () => expect(extractDefaults({
    "properties": {
      "default": {"default": "default"},
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
      "empty": {}
    }
  })).toStrictEqual({
    "default": "default",
    "examples": undefined,
    "default and examples": "default",
    "empty": undefined
  }))
})

describe(regexpize.name, () => {
  it("string => regexp", () => expect(regexpize(
    "abc"
  ).source).toBe(
    'abc'
  ))

  it("other => same", () => {
    const source = [] as unknown as RegExp

    expect(regexpize(
      source
    )).toBe(
      source
    )
  })
})
