import {dirname, resolve} from 'path'
import {sync} from 'globby'
import launch, {
  readOpts, rfs, suiteName
} from './test-runner'

const $cwd = process.cwd()
, suitesDir = "__func__"
, sourcePattern = `${suitesDir}/*.css`
, configPattern = `${suitesDir}/*/postcss-d-ts.config.json`
, expectMask = "*{MUST,SHOULD,MAY}.d.ts"
, globbing = (pattern: string) => sync(pattern, {
  "gitignore": true,
  "absolute": false
})
, sources = globbing(sourcePattern)
.reduce((acc, path) => (
  acc[suiteName(path)] = rfs(path),
  acc
), {} as Record<string, string>)

for (const configPath of globbing(configPattern)) {
  const suiteDir = dirname(configPath)
  , opts = readOpts(configPath)
  , expects = globbing(`${suiteDir}/${expectMask}`)

  describe(suiteName(suiteDir), () => {
    beforeAll(() => process.chdir(suiteDir))
    afterAll(() => process.chdir($cwd))

    for (const exp of expects) {
      const name = suiteName(exp)
      , from = resolve(exp).replace(".d.ts", "")
      , input = sources[name]

      it(name, () => launch({...opts, destination: {}})({
        from,
        input,
        outputPath: exp.replace(`${suiteDir}/`, "")
      }))
    }
  })
}
