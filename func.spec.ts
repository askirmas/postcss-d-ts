import {dirname, resolve} from 'path'
import {sync} from 'globby'
import { readOpts, rfs, suiteName, launcher, rfsl } from './test-runner'

const $cwd = process.cwd()
, suiteDir = "__func__"
, sourcePattern = `${suiteDir}/*.css`
, configPattern = `${suiteDir}/*/postcss-plugin-d-ts.config.json`
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


globbing(configPattern)
.forEach(configPath => {
  const suiteDir = dirname(configPath)
  , opts = readOpts(configPath)
  , expects = globbing(`${suiteDir}/${expectMask}`)

  describe(suiteName(suiteDir), () => {
    beforeAll(() => process.chdir(suiteDir))
    afterAll(() => process.chdir($cwd))

    expects.forEach(exp => {
      const name = suiteName(exp)
      , from = resolve(exp)
      , expectation = rfsl(exp)

      it(name, async () => {
        const destination: Record<string, string[]> = {}

        await launcher({
          ...opts,
          destination
        }).process(
          sources[name],
          {from}
        )
        expect(
          destination[from]
        ).toStrictEqual(
          expectation
        )
      })
    })
  })
})
