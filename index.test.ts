import postcss from 'postcss'
import globby from 'globby'
import {readFileSync} from 'fs'
import plugin, {PostCssPluginDTsOptions} from "./src"

async function run (from: string, opts?: PostCssPluginDTsOptions) {
  const input = rfs(from)
  , result = await postcss([plugin(opts)])
  .process(input, { from })

  expect(result.warnings()).toHaveLength(0)
  expect(
    rfs(`${from}.expected.d.ts`)
    .split("\n")
  ).toStrictEqual(
    rfs(`${from}.d.ts`)
    .split("\n")
  )
}

globby.sync("**/*.css", {gitignore: true})
.forEach(filepath => it(filepath, async () => await run(filepath)))

function rfs(path: string) {
  return readFileSync(path).toString()
}