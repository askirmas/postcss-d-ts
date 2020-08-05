import postcss from 'postcss'
import globby from 'globby'
import {readFileSync, statSync} from 'fs'
import plugin, {PostCssPluginDTsOptions} from "./src"

const files = globby.sync("**/*.css", {gitignore: true})

files
.forEach(filepath => it(filepath, async () => await run(filepath)))

it('no overwrite', async () => {
  const filepath = files[0]
  , stats = statSync(filepath)
  await run(filepath)
  expect(stats).toStrictEqual(statSync(filepath))
})


async function run (from: string, opts?: PostCssPluginDTsOptions) {
  const input = rfs(from)
  , result = await postcss([plugin(opts)])
  .process(input, { from })

  expect(result.warnings()).toHaveLength(0)
  expect(
    rfs(`${from.replace(/\.css$/, '')}.expected.d.ts`)
    .split("\n")
  ).toStrictEqual(
    rfs(`${from}.d.ts`)
    .split("\n")
  )
}

function rfs(path: string) {
  return readFileSync(path).toString()
}
