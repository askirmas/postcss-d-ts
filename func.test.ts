import {statSync, writeFileSync, appendFileSync, unlinkSync, existsSync} from 'fs'
import {resolve} from 'path'
import run, { rfsl, rfs } from './test-runner'

const FALSY = ["", undefined, null, false, 0,]
, from = "__unit__/index.css"
, dtsPath = `${from}.d.ts`

let dtsContent: string[]

describe('features', () => {
  describe('content overwrite', () => {
    beforeAll(() => existsSync(dtsPath) && unlinkSync(dtsPath))

    it(from, async () => {
      await run({from})
      dtsContent = rfsl(dtsPath)
      let {length} = dtsContent
      if (dtsContent[--length] === "")
        dtsContent.pop()
    })

    it('no overwrite on same content', async () => {
      const stats = statSync(from)
      await run({from})
      expect(stats).toStrictEqual(statSync(from))
    })
  
    it('overwrite on different content - appended', async () => {
      appendFileSync(dtsPath, "/**/")
      await(run({from}))
    })
  
    it('overwrite on different content - deleted several lines in the end', async () => {
      let {length} = dtsContent
      length -= 4
      writeFileSync(dtsPath, dtsContent.filter((_, i) => i < length).join('\n'))
      await(run({from}))
    })  
  })

  it('falsy file', async () => await Promise.all(
    //@ts-expect-error
    FALSY.map(from => run({from, input: ".class{}"}))
  ))
})

describe('options', () => {

  describe('identifierParser', () => {
    const runOpts =       {
      from,
      input: rfs(from)
    }
  
    it('not global pattern', async () => await run(
      {...runOpts, errorsCount: 1},
      {identifierParser: /\.([\w-]+)/}
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
      FALSY.map(destination => run({from, errorsCount: 1}, {destination}))
    ))
  }) 
})
