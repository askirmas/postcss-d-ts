import {statSync, appendFileSync, writeFileSync} from 'fs'
import {resolve} from "path"
import { platform } from "os"

import {launch, run, rfsl, rfs } from './test-runner'
import { $exists, $unlink } from './src/utils'

const osBasedAssertion = platform() ===  "darwin" ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"
, defaultLaunchers = launch()
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
  await run(defaultLaunchers, {from})
  dtsContent = rfsl(dtsPath)
})

describe('features', () => {
  it('falsy file', async () => await Promise.all(
    FALSY.map(from => run(defaultLaunchers, {
      //@ts-expect-error
      from,
      input: ".class{}"
    }))
  ))

  it("delete on empty", async () => {
    writeFileSync(dtsPath, dtsContent.join("\n"))
    await run(defaultLaunchers, {from, input: "input {}", outputPath: false})
    expect(await $exists(dtsPath)).toBe(false)
    writeFileSync(dtsPath, dtsContent.join("\n"))
  })

  describe('content overwrite', () => {
    beforeAll(async () => {
      await $unlink(dtsPath)
      await run(defaultLaunchers, {from, outputPath})
      dtsContent = rfsl(dtsPath)
    })

    it('no overwrite on same content', async () => {
      const modified = modifiedTime()
      await run(defaultLaunchers, {from, outputPath})
      expect(modifiedTime()).toBe(modified)
    })

    it('overwrite after file append', async () => {
      appendFileSync(dtsPath, "/**/")
      const modified = modifiedTime()
      await run(defaultLaunchers, {from, outputPath})
      expect(modifiedTime())[osBasedAssertion](modified)
    })
  })
})

describe("scenario", () => {
  const running = (file: string, outputPath: string|false = `${suitesDir}/${file}.css.d.ts`) => run(defaultLaunchers, {from, input: rfs(`${suitesDir}/${file}.css`), outputPath })

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
    it('not global pattern', async () => await run(
      launch({identifierPattern: /\.([\w-]+)/}),
      {
        from,
        input: fromContent,
        errorsCount: 1,
        outputPath
      }
    ))
  })

  describe("destination", () => {
    it('here', async () => {
      const destination = {}
      await run(
        launch({destination}),
        {from}
      )

      expect(
        destination
      ).toStrictEqual({
        [resolve(from)]: dtsContent
      })
    })

    it('falsy', async () => await Promise.all(
      FALSY.map(destination => destination === false ? void 0 :
        run(
          //@ts-expect-error
          launch({destination}),
          {from, errorsCount: 1}
        )
      )
    ))
  })

  describe("checkMode: true", () => {
    const launchers = launch({checkMode: true})

    it("modified", async () => {
      const created = modifiedTime()
      expect(await run(launchers, {from, input: ".input {}", outputPath: false}).catch(err => err)).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })

    it("exists, but shouldn't", async () => {
      const created = modifiedTime()
      expect(
        await run(launchers, {from, input: "input {}", outputPath: false})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })

    it("not exists, but should", async () => {
      await $unlink(dtsPath)
      expect(
        await run(launchers, {from, input: fromContent, outputPath: false})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(await $exists(dtsPath)).toBe(false)
      writeFileSync(dtsPath, dtsContent.join("\n"))
    })
  })
})
