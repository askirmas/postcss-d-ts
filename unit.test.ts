import {unlinkSync, existsSync} from 'fs'
import {resolve} from 'path'
import run, { rfsl, rfs } from './test-runner'

const FALSY = ["", undefined, null, false, 0,]
, suitFolder = "__unit__"
, from = `${suitFolder}/index.css`
, fromContent = rfs(from)

let dtsContent: Readonly<string[]>
beforeAll(async () => {
  const dtsPath = `${from}.d.ts`
  existsSync(dtsPath) && unlinkSync(dtsPath)
  await run({from})
  dtsContent = rfsl(dtsPath)
})


describe('features', () => {
  it('falsy file', async () => await Promise.all(
    //@ts-expect-error
    FALSY.map(from => run({from, input: ".class{}"}))
  ))
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
    it('destionation here', async () => {
      const destination = {}
      await run({from}, {destination})
      expect(
        destination
      ).toStrictEqual({
        [resolve(from)]: dtsContent
      })
    })
  
    it('falsy destination', async () => await Promise.all(
      //@ts-expect-error
      FALSY.map(destination => destination !== false && run({from, errorsCount: 1}, {destination}))
    ))
  }) 
})
