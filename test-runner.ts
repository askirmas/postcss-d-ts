import {readFileSync} from 'fs'
import type { Options } from './src/options.types'
import postcss7 = require("postcss")
import creator7 = require("./src/7")
import postcss8 from 'postcss8'
import creator8 = require("./src")

export type RunOpts = Partial<{
  from: string
  input: string
  outputPath: string | false
  errorsCount: number
}>

const {parse: $parse} = JSON
, launch = (opts?: Options) => [postcss7([creator7(opts)]), postcss8([creator8(opts)])]

export {
  launch, run,
  rfs, rfsl, readOpts, suiteName
}

async function run(launchers: ReturnType<typeof launch>, runOpts: RunOpts) {
  const {
    errorsCount = 0,
    from,
    input = from && rfs(from),
  } = runOpts
  if (!input)
    throw Error("no test input")

  for (let i = 0; i < launchers.length; i++) {
    const result = await launchers[i].process(input, { from })
    , { outputPath: output } = runOpts

    expect(result.warnings()).toHaveLength(errorsCount)

    output && expect(rfsl(`${from}.d.ts`)).toStrictEqual(rfsl(output))
  }
}

function rfs(path: string) {
  return readFileSync(path).toString()
}

function rfsl(path: string, eol = "\n") {
  return rfs(path).split(eol)
}

function readOpts(path: string) {
  return $parse(rfs(path)) as Options
}

function suiteName(path: string) {
  return path
  .replace(/^.*[\/\\]/, '')
  .replace(/\..*$/, '')
}
