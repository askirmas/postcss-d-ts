import postcss from 'postcss'
import plugin, {Options} from "../src"

import {readFileSync} from 'fs'

async function run (filename: string, opts?: Options) {
  const from = `${__dirname}/${filename}.css`
  , input = rfs(from)
  , result = await postcss([plugin(opts)])
  .process(input, { from })

  expect(result.warnings()).toHaveLength(0)
  expect(rfs(`${from}.expected.d.ts`)).toStrictEqual(rfs(`${from}.d.ts`))
}

it('does something', async () => {
  await run("first", { })
})


function rfs(path: string, split?: false) :string
function rfs(path: string, split: true) :string[]
function rfs(path: string, split = false) {
  const content = readFileSync(path).toString()
  return split ? content.split("\n") : content
}