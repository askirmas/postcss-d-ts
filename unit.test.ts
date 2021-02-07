import {dirname, resolve} from 'path'
import {sync} from 'globby'
import { readOpts, rfs, suiteName, launcher, rfsl } from './test-runner'

const unitsDir = "__unit__"
, sourcePattern = `${unitsDir}/*.css`
, configPattern = `${unitsDir}/*/postcss-plugin-d-ts.config.json`
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
  , destination: Record<string, string[]> = {} 
  , launch = launcher({
    ...opts,
    destination
  })
  , expects = globbing(`${suiteDir}/${expectMask}`)

  describe(suiteName(suiteDir), () =>
    expects.forEach(exp => {
      const name = suiteName(exp) 
      , from = resolve(exp)

      it(name, async () => {
        await launch.process(
          sources[name],
          {from}
        )
        expect(
          destination[from]
        ).toStrictEqual(
          rfsl(exp)
        )
      })
    })
  )
})
