import rewrite = require("./rewrite")
import {resolve} from "path"
import {readFileSync, appendFileSync, statSync, writeFileSync, existsSync, unlinkSync} from "fs"

const eol = "\n"
, ctx = (fileName: string) => {
  const filePath = resolve(__dirname, "rewrite.test", fileName)
  , modified = () => statSync(filePath).mtimeMs
  , original = readFileSync(filePath).toString().split(eol)
  , write = (content: string[]) => writeFileSync(filePath, content.join(eol))

  afterEach(() => write(original))

  return {
    filePath,
    original,
    modified,
    write
  }
}

it("not exists - to write", async () => {
  const filename = "rewrite.txt";
  expect(existsSync(filename)).toBe(false)
  await rewrite("rewrite.txt", ["whatever"], "")
  expect(existsSync(filename)).toBe(true)
  unlinkSync(filename)
})

describe("with_last_new_line", () => {
  const {filePath, original, modified, write} = ctx("with_last_new_line.txt")

  it("same => No rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBe(m)
  })

  it("append => Rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original.concat(""), eol)
    expect(modified()).toBeGreaterThan(m)
  })

  it("appended => Rewrite", async () => {
    appendFileSync(filePath, "\n")
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBeGreaterThan(m)
  })

  it("detach => Rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original.slice(-1), eol)
    expect(modified()).toBeGreaterThan(m)
  })

  it("detached => Rewrite", async () => {
    write(original.slice(-1))
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBeGreaterThan(m)
  })
})

describe("without_last_new_line", () => {
  const {filePath, original, modified, write} = ctx("without_last_new_line.txt")

  it("same => No rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBe(m)
  })

  it("appended => No rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original.concat(""), eol)
    expect(modified()).toBe(m)
  })

  it("appended => No rewrite", async () => {
    appendFileSync(filePath, "\n")
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBe(m)
  })

  it("detach => Rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original.slice(-1), eol)
    expect(modified()).toBeGreaterThan(m)
  })

  it("detached => Rewrite", async () => {
    write(original.slice(-1))
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified()).toBeGreaterThan(m)
  })
})
