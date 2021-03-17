import {statSync, appendFileSync, unlinkSync, existsSync} from 'fs'
import {resolve} from 'path'
import run, { rfsl, rfs } from './test-runner'

import { platform } from "os"

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
  existsSync(dtsPath) && unlinkSync(dtsPath)
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
      existsSync(dtsPath) && unlinkSync(dtsPath)
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
})
