import {statSync, appendFileSync, writeFileSync} from 'fs'
import {resolve} from "path"
import { platform } from "os"

import {launch, run, rfsl, rfs } from './test-runner'
import { $exists, $unlink } from './src/utils'

const osBasedAssertion = platform() ===  "darwin" ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"
, defaultLaunchers = launch()
, FALSY = ["", undefined, null, false, 0]
, suitFolder = "__unit__"
, from = `${suitFolder}/index.css`
, output = `${suitFolder}/index.SHOULD.d.ts`
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
      await run(defaultLaunchers, {from, outputPath: output})
      dtsContent = rfsl(dtsPath)
    })

    it('no overwrite on same content', async () => {
      const modified = modifiedTime()
      await run(defaultLaunchers, {from, outputPath: output})
      expect(modifiedTime()).toBe(modified)
    })

    it('overwrite after file append', async () => {
      appendFileSync(dtsPath, "/**/")
      const modified = modifiedTime()
      await run(defaultLaunchers, {from, outputPath: output})
      expect(modifiedTime())[osBasedAssertion](modified)
    })

  })
})

describe('options', () => {
  describe('identifierPattern', () => {
    it('not global pattern', async () => await run(
      launch({identifierPattern: /\.([\w-]+)/}),
      {
        from,
        input: fromContent,
        errorsCount: 1,
        outputPath: output
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
