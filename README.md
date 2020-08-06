# PostCSS TypeScript declarations

```bash
npm install postcss-plugin-d-ts
```

[PostCSS] plugin generates [`.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) for all processed style sheets

[[_TOC_]]

## Example

*TBD Clone from specs*

## Options

*TBD Clone here*

### Resources
- JsonSchema

See https://github.com/askirmas/postcss-plugin-d-ts/blob/master/__spec__/next3/postcss.config.json
- TypeScript
```typescript
import { Options as DTsOptions} from "postcss-plugin-d-ts/dist/options"
const dtsOpts: DTsOptions = {}
```
- JSDoc

See https://github.com/askirmas/postcss-plugin-d-ts/blob/master/__spec__/next5/postcss.config.js

## PostCss Usage

[PostCSS]: https://github.com/postcss/postcss

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
    require('autoprefixer'),
+   require('postcss-plugin-d-ts'),
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
