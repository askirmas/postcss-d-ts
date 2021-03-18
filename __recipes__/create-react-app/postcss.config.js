!process.env.NODE_ENV && (process.env.NODE_ENV = "development")

const craConfig = require("react-scripts/config/webpack.config")()

const {oneOf} = craConfig.module.rules.find(({oneOf}) => oneOf)

const {use} = oneOf.find(({use}) => use && use
  .some(({options: {ident}}) => ident === "postcss")
)

const {options} = use.find(({options: {ident}}) => ident === "postcss")
const plugins = options.plugins()

plugins.push(require("postcss-d-ts/dist/7"))

module.exports = {
  ...options,
  plugins
}
