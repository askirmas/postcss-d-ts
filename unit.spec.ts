import {statSync, appendFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'
import run, { rfsl, rfs } from './test-runner'

import { platform } from "os"
import { $exists, $unlink } from './src/utils'

const osBasedAssertion = platform() ===  "darwin" ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"
, FALSY = ["", undefined, null, false, 0]
, suitFolder = "__unit__"
, from = `${suitFolder}/index.css`
, fromContent = rfs(from)
, dtsPath = `${from}.d.ts`
, modifiedTime = () => statSync(dtsPath).mtimeMs

let dtsContent: Readonly<string[]>
beforeAll(async () => {
  const dtsPath = `${from}.d.ts`
  await $unlink(dtsPath)
  await run({from})
  dtsContent = rfsl(dtsPath)
})


describe('features', () => {
  it('falsy file', async () => await Promise.all(
    FALSY.map(from => run({
      //@ts-expect-error
      from,
      input: ".class{}"
    }))
  ))

  describe('content overwrite', () => {
    beforeAll(async () => {
      await $unlink(dtsPath)
      await run({from})
      dtsContent = rfsl(dtsPath)
    })

    it('no overwrite on same content', async () => {
      const modified = modifiedTime()
      await run({from})
      expect(modifiedTime()).toBe(modified)
    })

    it('overwrite after append new content', async () => {
      appendFileSync(dtsPath, "/**/")
      const modified = modifiedTime()
      await run({from})
      expect(modifiedTime())[osBasedAssertion](modified)
    })

    it('no overwrite on template without last newline', async () => {
      const modified = modifiedTime()
      await run({from}, {"template": `${suitFolder}/template_without_last_newline.d.ts`})
      expect(modifiedTime()).toBe(modified)
    })
  })
})

describe('options', () => {

  describe('identifierPattern', () => {
    const runOpts = {
      from,
      input: fromContent
    }

    it('not global pattern', async () => await run(
      {...runOpts, errorsCount: 1},
      {identifierPattern: /\.([\w-]+)/}
    ))
  })

  describe("destination", () => {
    it('here', async () => {
      const destination = {}
      await run({from}, {destination})
      expect(
        destination
      ).toStrictEqual({
        [resolve(from)]: dtsContent
      })
    })

    it('falsy', async () => await Promise.all(
      FALSY.map(destination => destination === false ? void 0 :
        run({from, errorsCount: 1}, {
          //@ts-expect-error
          destination
        })
      )
    ))
  })

  it("delete on empty", async () => {
    writeFileSync(dtsPath, dtsContent.join("\n"))
    await run({from, input: "input {}", output: false})
    expect(await $exists(dtsPath)).toBe(false)
    writeFileSync(dtsPath, dtsContent.join("\n"))
  })

  describe("checkMode", () => {
    it("production", async () => {
      const {NODE_ENV} = process.env
      , created = modifiedTime()
      //@ts-expect-error
      process.env.NODE_ENV = "production"
      expect(await run({from, input: ".input {}"}).catch(err => err)).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
      //@ts-expect-error
      process.env.NODE_ENV = NODE_ENV
    })

    it("true", async () => {
      const created = modifiedTime()
      expect(await run({from, input: ".input {}"}, {checkMode: true}).catch(err => err)).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })
  })

  describe("checkMode + existence", () => {
    it("exists, but shouldn't", async () => {
      const created = modifiedTime()
      expect(
        await run({from, input: "input {}", output: false}, {checkMode: true})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(modifiedTime()).toBe(created)
    })

    it("not exists, but should", async () => {
      await $unlink(dtsPath)
      expect(
        await run({from, input: fromContent, output: false}, {checkMode: true})
        .catch(err => err)
      ).toBeInstanceOf(Error)
      expect(await $exists(dtsPath)).toBe(false)
      writeFileSync(dtsPath, dtsContent.join("\n"))
    })
  })
})
