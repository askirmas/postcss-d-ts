import type { Options } from './options.types'
import postcss = require("postcss")
import creator8 = require(".")
import meta = require("./meta.json")

export = postcss.plugin<Options>(meta.name, opts => {
  const {
    prepare
  } = creator8(opts)

  return async (root, result) => {
    const {
      RootExit, RuleExit
    } = prepare(result as typeof result & {root: typeof root})

    if (!(RootExit && RuleExit))
      return

    root.walkRules(RuleExit)

    await RootExit(root)

    return
  }
})

