import rewrite = require("./rewrite")
import {statSync, writeFileSync, unlinkSync, existsSync} from "fs"
import { rfsl } from "../test-runner"

const eol = "\n"
, filePath = `${__dirname}/rewrite.txt`
, whenModified = () => statSync(filePath).mtimeMs
, $unlink = () => existsSync(filePath) && unlinkSync(filePath)
, write = (content: string[]) => {
  writeFileSync(filePath, content.join(eol))
  return whenModified()
}
, rewriteCheck = async (content: string[], expectedContent = content) => {
  await rewrite(filePath, content, eol)
  expect(rfsl(filePath)).toStrictEqual(expectedContent)
  return whenModified()
}

afterAll($unlink)

describe("create", () => {
  beforeEach($unlink)

  it("content", async () => expect(typeof await rewriteCheck(
    ["content"]
  )).toBe("number"))
  it("empty", async () => expect(typeof await rewriteCheck(
    [""]
  )).toBe("number"))
  it("blank", async () => expect(typeof await rewriteCheck(
    [],
    [""]
  )).toBe("number"))
})

describe("same", () => {
  it("no last line", async () => {
    const created = write(["first line", "second line"])
    expect(await rewriteCheck(["first line", "second line"])).toBe(created)
  })

  it("with last line", async () => {
    const created = write(["first line", "second line", ""])
    expect(await rewriteCheck(["first line", "second line", ""])).toBe(created)
  })

  it("with 2 last lines", async () => {
    const created = write(["first line", "second line", "", ""])
    expect(await rewriteCheck(["first line", "second line", "", ""])).toBe(created)
  })
})

describe("cross new lines", () => {
  it("with to no", async () => {
    const created = write(["first line", "second line", ""])
    expect(await rewriteCheck(
      ["first line", "second line"],
      ["first line", "second line", ""]
    )).toBe(
      created
    )
  })

  it("no to with", async () => {
    const created = write(
      ["first line", "second line"]
    )
    expect(await rewriteCheck(
      ["first line", "second line", ""],
      ["first line", "second line"]
    )).toBe(created)
  })
})

describe("modifications", () => {
  it("less", async () => {
    write(["first line", "second line", "third line", ""])
    await rewriteCheck(["first line", "second line", ""])
  })
  it("more", async () => {
    write(["first line", "second line", ""])
    await rewriteCheck(["first line", "second line", "third line", ""])
  })
  it("changed", async () => {
    write(["first line", "second line", "old line", ""])
    await rewriteCheck(["first line", "second line", "third line", ""])
  })
})
