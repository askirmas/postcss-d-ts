import {readFileSync} from 'fs'
import postcss from 'postcss'
import plugin from "./src"
import { Options } from './src/options'

export type RunOpts = Partial<{
  from: string
  input: string
  output: string
  errorsCount: number
}>

const {parse: $parse} = JSON

export default run
export {
  rfs, rfsl, readOpts, suiteName, launcher
}

function launcher(opts?: Options) {
  return postcss([plugin(opts)])
}

async function run(runOpts: RunOpts, opts?: Options) {
  const {
    errorsCount = 0,
    from,
    input = from && rfs(from)
  } = runOpts
  if (!input)
    throw Error("no test input")

  const result = await launcher(opts).process(input, { from })
  , {
    output = from && rfs(`${from.replace(/\.css$/, '')}.SHOULD.d.ts`)
  } = runOpts

  expect(result.warnings()).toHaveLength(errorsCount)
  
  if (output)
    expect(
      rfsl(`${from}.d.ts`)
    ).toStrictEqual(
      output
      .split("\n")
    )
  
  return result
}

function rfs(path: string) {
  return readFileSync(path).toString()
}

function rfsl(path: string) {
  return rfs(path).split('\n')
}

function readOpts(path: string) {
  return $parse(rfs(path)) as Options
}

function suiteName(path: string) {
  return path
  .replace(/^.*[\/\\]/, '')
  .replace(/\..*$/, '')
}