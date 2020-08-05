import {resolve} from "path"
import {readFileSync, statSync, writeFileSync, appendFileSync} from 'fs'
import postcss from 'postcss'
import globby from 'globby'
import plugin, {PostCssPluginDTsOptions} from "./src"

const FALSY = ["", undefined, null, false, 0,]
, cwd = process.cwd()
, sources = globby.sync("**/*.css", {gitignore: true})

describe("default options", () =>
  sources
  .forEach(from => it(from, async () => await run({from})))
)

describe('features', () => {
  const from = resolve(cwd, sources[0])
  , dtsPath = `${from}.d.ts`
  
  let dtsContent: string[]

  beforeAll(() => {
    dtsContent = rfs(dtsPath).split("\n")
    let {length} = dtsContent
    if (dtsContent[--length] === "")
      dtsContent.pop()
  })

  describe('content overwrite', () => {
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

  describe("destination", () => {
    it('destionation here', async () => {
      const destination = {}
      await run({from}, {destination})
      expect(
        destination
      ).toStrictEqual({
        [from]: dtsContent
      })
    })
  
    it('falsy destination', async () => await Promise.all(
      //@ts-expect-error
      FALSY.map(destination => run({from, errorsCount: 1}, {destination}))
    ))
  })


  it('falsy file', async() => await Promise.all(
    //@ts-expect-error
    FALSY.map(from => run({from, input: ".class{}"}))
  ))
})

type RunOpts = Partial<{
  from: string
  input: string
  output: string
  errorsCount: number
}>

async function run (runOpts: RunOpts, opts?: PostCssPluginDTsOptions
  ) {
  const {
    errorsCount = 0,
    from,
    input = from && rfs(from)
  } = runOpts
  if (!input)
    throw Error("no test input")

  const result = await postcss([plugin(opts)])
  .process(input, { from })
  , {
    output = from && rfs(`${from.replace(/\.css$/, '')}.SHOULD.d.ts`)
  } = runOpts

  expect(result.warnings()).toHaveLength(errorsCount)
  
  if (output)
    expect(
      output
      .split("\n")
    ).toStrictEqual(
      rfs(`${from}.d.ts`)
      .split("\n")
    )
  
  return result
}

function rfs(path: string) {
  return readFileSync(path).toString()
}
