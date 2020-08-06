# PostCSS TypeScript declarations

[PostCSS] plugin generates [`.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) for all processed style sheets

[[_TOC_]]

## Example

TBD

## Options
- JsonSchema
https://askirmas.github.io/postcss-plugin-d-ts/schema.json
- TypeScript
```typescript
import {PostCssPluginDTsOptions} from postcss-plugin-d-ts
```
- JavaScript

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
