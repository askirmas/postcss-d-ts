import { extractDefaults } from "./utils";

describe(extractDefaults.name, () => {
  it("demo", () => expect(extractDefaults({
    "properties": {
      "default": {
        "default": "default"
      },
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
