import {dirname, resolve} from 'path'
import {sync} from 'globby'
import { readOpts, rfs, suiteName, launcher, rfsl } from './test-runner'

const cwd = "__unit__"
, sourcePattern = `${cwd}/*.css`
, configPattern = `${cwd}/*/postcss-plugin-d-ts.config.json`
, expectMask = "*.d.ts"
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
  , destination: Record<string, string[]> = {} 
  , launch = launcher({
    ...readOpts(configPath),
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
