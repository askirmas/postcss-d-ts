import {readFileSync} from 'fs'
import type { Options } from './src/options.types'
import postcss7 = require("postcss")
import creator7 = require("./src/7")
import postcss8 from 'postcss8'
import creator8 = require("./src")

export type RunOpts = Partial<{
  from: string
  input: string
  output: string[]
  errorsCount: number
}>

const {parse: $parse} = JSON
, launcher7 = (opts?: Options) => postcss7([creator7(opts)])
, launcher8 = (opts?: Options) => postcss8([creator8(opts)])
, launchers = [launcher7, launcher8]

export default run
export {
  rfs, rfsl, readOpts, suiteName
}

async function run(runOpts: RunOpts, opts?: Options) {
  const {
    errorsCount = 0,
    from,
    input = from && rfs(from),
  } = runOpts
  if (!input)
    throw Error("no test input")

  for (let i = 0; i < launchers.length; i++) {
    const result = await launchers[i](opts).process(input, { from })
    , {
      //TODO propagate modality with opts
      output = from && rfsl(`${from.replace(/\.css$/, '')}.SHOULD.d.ts`)
    } = runOpts

    expect(result.warnings()).toHaveLength(errorsCount)

    output && expect(rfsl(`${from}.d.ts`)).toStrictEqual(output)
  }
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
