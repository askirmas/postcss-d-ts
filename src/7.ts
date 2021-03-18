import type {Options} from './options.types'
import postcss = require("postcss")
import creator8 = require(".")
import schema = require("./schema.json")

export = postcss.plugin<Options>(schema.title, opts => {
  const {prepare} = creator8(opts)

  return async(root, result) => {
    const {RootExit, RuleExit} = prepare(result as typeof result & {root: typeof root})

    if (!(RootExit && RuleExit))
      return

    root.walkRules(RuleExit)

    await RootExit(root)

    return
  }
})

