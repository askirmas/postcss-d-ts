import {statSync, appendFileSync, writeFileSync} from 'fs'
import {resolve} from "path"
import { platform } from "os"

import launch, { rfsl, rfs } from './test-runner'
import { $exists, $unlink } from './src/utils'

const osBasedAssertion = platform() ===  "darwin" ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"
, launchDefault = launch()
, FALSY = ["", undefined, null, false, 0]
, suitesDir = "__unit__"
, from = `${suitesDir}/index.css`
, outputPath = `${suitesDir}/index.SHOULD.d.ts`
, fromContent = rfs(from)
, dtsPath = `${from}.d.ts`
, modifiedTime = () => statSync(dtsPath).mtimeMs

let dtsContent: Readonly<string[]>

beforeAll(async () => {
  const dtsPath = `${from}.d.ts`
  await $unlink(dtsPath)
  await launchDefault({from})
  dtsContent = rfsl(dtsPath)
})

describe('features', () => {
  it('falsy file', async () => await Promise.all(
    FALSY.map(from => launchDefault({
      //@ts-expect-error
      from,
      input: ".class{}"
    }))
  ))

  it("delete on empty", async () => {
    writeFileSync(dtsPath, dtsContent.join("\n"))
    await launchDefault({from, input: "input {}", outputPath: false})
    expect(await $exists(dtsPath)).toBe(false)
    writeFileSync(dtsPath, dtsContent.join("\n"))
  })

  describe('content overwrite', () => {
    beforeAll(async () => {
      await $unlink(dtsPath)
      await launchDefault({from, outputPath})
      dtsContent = rfsl(dtsPath)
    })

    it('no overwrite on same content', async () => {
      const modified = modifiedTime()
      await launchDefault({from, outputPath})
      expect(modifiedTime()).toBe(modified)
    })

    it('overwrite after file append', async () => {
      appendFileSync(dtsPath, "/**/")
      const modified = modifiedTime()
      await launchDefault({from, outputPath})
      expect(modifiedTime())[osBasedAssertion](modified)
    })
  })
})

describe("scenario", () => {
  const running = (file: string, outputPath: string|false = `${suitesDir}/${file}.css.d.ts`) => launchDefault({from, input: rfs(`${suitesDir}/${file}.css`), outputPath })

  it("start", () => running("index"))
  it("strip to classname", () => running("only-classname"))
  it("change to button", () => running("only-button"))
  it("no classes", async () => {
    await running("empty", false)
    expect(await $exists(dtsPath)).toBe(false)
  })
  it("classname", () => running("only-classname"))
  it("append to recovery", () => running("index"))
})


describe('options', () => {
  describe('identifierPattern', () => {
    it('not global pattern', () => launch({
      identifierPattern: /\.([\w-]+)/,
      checkMode: true
    })({
      from: `${suitesDir}/only-button.css`,
      input: rfs(`${suitesDir}/only-button-due-to-bad-identifier.css`),
      errorsCount: 1,
      outputPath: false
    }))
  })

  describe("destination", () => {
    it('here', async () => {
      const destination = {}
      await launch({destination})({from})

      expect(
        destination
      ).toStrictEqual({
        [resolve(from)]: dtsContent
      })
    })

    it('falsy', async () => await Promise.all(
      FALSY.map(destination => destination === false
        ? void 0
        //@ts-expect-error
        : launch({destination})({from, errorsCount: 1})
      )
    ))
  })

  describe("checkMode: true", () => {
    const launchCheckMode = launch({checkMode: true})

    it("modified", async () => {
      const created = modifiedTime()
      expect(await launchCheckMode({from, input: ".input {}", outputPath: false}).catch(err => err)).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })

    it("exists, but shouldn't", async () => {
      const created = modifiedTime()
      expect(
        await launchCheckMode({from, input: "input {}", outputPath: false})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })

    it("not exists, but should", async () => {
      await $unlink(dtsPath)
      expect(
        await launchCheckMode({from, input: fromContent, outputPath: false})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(await $exists(dtsPath)).toBe(false)
      writeFileSync(dtsPath, dtsContent.join("\n"))
    })
  })
})
