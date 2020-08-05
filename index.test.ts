import {resolve} from "path"
import {readFileSync, statSync} from 'fs'
import postcss from 'postcss'
import globby from 'globby'
import plugin, {PostCssPluginDTsOptions} from "./src"

const cwd = process.cwd()
, sources = globby.sync("**/*.css", {gitignore: true})

describe("content", () =>
  sources
  .forEach(sourcePath => it(sourcePath, async () => await run(sourcePath)))
)

describe('features', () => {
  const sourcePath = resolve(cwd, sources[0])
  
  let content: string[]

  beforeAll(() => {
    content = rfs(`${sourcePath}.d.ts`).split("\n")
    let {length} = content
    if (content[--length] === "")
      content.pop()
  })

  it('no overwrite on same content', async () => {
    const stats = statSync(sourcePath)
    await run(sourcePath)
    expect(stats).toStrictEqual(statSync(sourcePath))
  })

  it('destionation here', async () => {
    const destination = {}
    await run(sourcePath, {destination})
    expect(
      destination
    ).toStrictEqual({
      [sourcePath]: content
    })
  })
})


async function run (from: string, opts?: PostCssPluginDTsOptions, errorsCount: number = 0) {
  const input = rfs(from)
  , result = await postcss([plugin(opts)])
  .process(input, { from })

  expect(result.warnings()).toHaveLength(errorsCount)
  expect(
    rfs(`${from.replace(/\.css$/, '')}.SHOULD.d.ts`)
    .split("\n")
  ).toStrictEqual(
    rfs(`${from}.d.ts`)
    .split("\n")
  )
}

function rfs(path: string) {
  return readFileSync(path).toString()
}
