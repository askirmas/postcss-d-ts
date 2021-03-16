import rewrite = require("./rewrite")
import {resolve} from "path"
import {readFileSync, appendFileSync, statSync, writeFileSync, existsSync, unlinkSync} from "fs"

import { platform } from "os"

const osBasedAssertion = platform() ===  "darwin" ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"

const eol = "\n"
, ctx = (fileName: string) => {
  //TODO change to .cwd setting
  const filePath = resolve(__dirname, "rewrite.test", fileName)
  , modified = () => statSync(filePath).mtimeMs
  , read = () => readFileSync(filePath).toString().split(eol)
  , write = (content: string[]) => writeFileSync(filePath, content.join(eol))
  , original = read()

  afterEach(() => write(original))

  return {
    filePath,
    original,
    modified,
    read,
    write
  }
}

it("not exists - to write", async () => {
  const filename = "rewrite.txt";
  expect(existsSync(filename)).toBe(false)
  await rewrite(filename, ["whatever"], "")
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
    expect(modified())[osBasedAssertion](m)
  })

  it("appended => Rewrite", async () => {
    appendFileSync(filePath, "\n")
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified())[osBasedAssertion](m)
  })

  it("detach => Rewrite", async () => {
    const m = modified()
    await rewrite(filePath, original.slice(-1), eol)
    expect(modified())[osBasedAssertion](m)
  })

  it("detached => Rewrite", async () => {
    write(original.slice(-1))
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified())[osBasedAssertion](m)
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
    expect(modified())[osBasedAssertion](m)
  })

  it("detached => Rewrite", async () => {
    write(original.slice(-1))
    const m = modified()
    await rewrite(filePath, original, eol)
    expect(modified())[osBasedAssertion](m)
  })
})

describe("scenario", () => {
  const {filePath, read, original, write} = ctx("base.txt")

  it("trunc", async () => {
    write(original.concat(`${Math.random()}\n`))
    await rewrite(filePath, original, eol)
    expect(read()).toStrictEqual(original)
  })

  it("append", async () => {
    write(original.slice(-2))
    await rewrite(filePath, original, eol)
    expect(read()).toStrictEqual(original)
  })

  it("rewrite less", async () => {
    write(original.slice(-2).concat(`${Math.random()}`))
    await rewrite(filePath, original, eol)
    expect(read()).toStrictEqual(original)
  })

  it("rewrite more", async () => {
    write(original.slice(-2).concat(`${Math.random()}\n`.repeat(3)))
    await rewrite(filePath, original, eol)
    expect(read()).toStrictEqual(original)
  })
})
