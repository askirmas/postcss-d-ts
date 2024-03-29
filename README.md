# [postcss-d-ts](https://github.com/askirmas/postcss-d-ts) [<img src="https://raw.githubusercontent.com/askirmas/postcss-d-ts/master/images/postcss-d-ts.svg" alt="logo" height="51px" align="right" />](https://github.com/askirmas/postcss-d-ts)

[PostCSS] plugin to generate [`.d.ts`] of all used CSS classes and ids in imported stylesheets

[![build@ci](https://github.com/askirmas/postcss-d-ts/workflows/build/badge.svg)](https://github.com/askirmas/postcss-d-ts/actions)
[![codecov](https://codecov.io/gh/askirmas/postcss-d-ts/branch/master/graph/badge.svg?token=TFJ9TMJ3YJ)](https://codecov.io/gh/askirmas/postcss-d-ts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=askirmas_postcss-d-ts&metric=alert_status)](https://sonarcloud.io/dashboard?id=askirmas_postcss-d-ts)
[![Maintainability](https://api.codeclimate.com/v1/badges/f6a1ef03e39733e2827c/maintainability)](https://codeclimate.com/github/askirmas/postcss-d-ts/maintainability)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/askirmas/postcss-d-ts/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/askirmas/postcss-d-ts/?branch=master)
[![DeepScan grade](https://deepscan.io/api/teams/13158/projects/16299/branches/346523/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13158&pid=16299&bid=346523)
[![CodeFactor](https://www.codefactor.io/repository/github/askirmas/postcss-d-ts/badge)](https://www.codefactor.io/repository/github/askirmas/postcss-d-ts)

[![dependencies Status](https://status.david-dm.org/gh/askirmas/postcss-d-ts.svg)](https://david-dm.org/askirmas/postcss-d-ts)
[![version](https://img.shields.io/npm/v/postcss-d-ts)](https://www.npmjs.com/package/postcss-d-ts)
[![license](https://img.shields.io/npm/l/postcss-d-ts)](https://github.com/askirmas/postcss-d-ts/blob/master/LICENSE)

<p align="center"><a href="https://github.com/askirmas/postcss-d-ts/blob/master/images/postcss-d-ts.gif"><img src="https://raw.githubusercontent.com/askirmas/postcss-d-ts/master/images/postcss-d-ts.gif"/></a></p>

## Goal

Provide [contract](https://en.wikipedia.org/wiki/Design_by_contract) between JS and CSS.

## Installation and setup

```bash
npm install postcss-d-ts
```

```diff
// postcss.config.js
module.exports = {
	plugins: [
	  "postcss-preset-env",
  	...
+	  "postcss-d-ts"  // or "postcss-d-ts/dist/7" for postcss v7
	]
}
```

Check [postcss#usage](https://github.com/postcss/postcss#Usage) for details.

## Features

### Languages <img src="https://raw.githubusercontent.com/askirmas/postcss-d-ts/master/images/postcss-d-ts.frameworks.gif" width="50%" align="right"/>

Language agnostic because of PostCss philosophy

<br clear="all"/>

### CSS libraries/frameworks

In [./\_\_typing\_\_/](https://github.com/askirmas/postcss-d-ts/blob/master/__typing__/) results of applying to some popular libraries: [bootstrap v3](https://github.com/askirmas/postcss-d-ts/blob/master/__typing__/bootstrap3.SHOULD.d.ts), [bootstrap v4](https://github.com/askirmas/postcss-d-ts/blob/master/__typing__/bootstrap4.SHOULD.d.ts), [material v10](https://github.com/askirmas/postcss-d-ts/blob/master/__typing__/material10.SHOULD.d.ts), [tailwind v2](https://github.com/askirmas/postcss-d-ts/commit/9514c9e62539127ffd9eaf85fb014efe2daec793#diff-f4d033574661830df6b3d15cfd8d47b76c2ed02cc525b1934242dcff8fc816c0).

## Applyment <img src="https://raw.githubusercontent.com/askirmas/postcss-d-ts/master/images/postcss-d-ts.full.gif" width="50%" align="right"/>

CSS content:

```css
/* some.css or some.module.css */
.class1 { ... }
.class2 { ... }
```

Generated declaration from template (i.e. default *[./src/\_css-template.d.ts](https://github.com/askirmas/postcss-d-ts/blob/master/src/_css-template.d.ts)*):

```typescript
declare const identifiersMap: CssIdentifiersMap

export default identifiersMap

export type CssIdentifiersMap = {
  "class1": string|undefined
  "class2": string|undefined
}
```

Thus, in Component (i.e. React): *[./\_\_recipes\_\_/pages/module.tsx](https://github.com/askirmas/postcss-d-ts/blob/master/__recipes__/pages/module.tsx)*

```tsx
import moduleClasses from "./some.module.css"

const {
  class1,
  class2,
  //@ts-expect-error - we have only .class1 and .class2
  class3
} = moduleClasses

const Component = () => <div className={`${class1} ${class2}`}/>
```

or  *[./\_\_recipes\_\_/pages/button.tsx](https://github.com/askirmas/postcss-d-ts/blob/master/__recipes__/pages/button.tsx)*

```tsx
// Ordinary CSS
import type { CssIdentifiersMap } from "./some.css"
// I.e. with help of https://www.npmjs.com/package/react-classnaming
import classNaming from "react-classnaming"

const {
  class1,
  class2,
  //@ts-expect-error - we have only .class1 and .class2
  class3
} = {} as CssIdentifiersMap

const classNames = classNaming()

const Component() => <div {...classNames({class1, class2})} />
```

> [`npm install react-classnaming`](https://github.com/askirmas/react-classnaming)

## Options

### `template: string`

Local path to a custom template for declarations generating.

- Default: *[./src/\_css-template.d.ts](https://github.com/askirmas/postcss-d-ts/blob/master/src/_css-template.d.ts)*

```typescript
declare const identifiersMap: CssIdentifiersMap

export default identifiersMap

export type CssIdentifiersMap = {
  "__identifier__": string|undefined
}
```

- Example: *[./\_\_func\_\_/template--custom\_path/template.d.ts](https://github.com/askirmas/postcss-d-ts/blob/master/__func__/template--custom_path/)*

```typescript
import type { CSSProperties } from "react";
interface Styled {
  __identifier__: Record<string, CSSProperties>;
}
declare const styled: Styled;
export default styled;
export declare const __identifier__: CSSProperties;
```

### `identifierKeyword: string`
The word in `d.ts` template to be replaced with CSS classes, ids, etc.

```diff
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-d-ts": {
+     identifierKeyword: "data"
    }
  }
}
```

```diff
// _css-template.d.ts
export type CssIdentifiersMap = {
-  "__identifier__": string|undefined
+  "data": string|undefined
}
```

### `checkMode: boolean `

Throw an error instead of declaration file rewrite. By default, this mode is on for `NODE_ENV === 'production'`

### Other options

Full list in different formats

- [JSON schema](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings): [./\_\_recipes\_\_/next\_9/postcss.config.json](https://github.com/askirmas/postcss-d-ts/blob/299955b1335037b759dd2a0960db9df2816bd326/__recipes__/next_9/postcss.config.json):
  - https://askirmas.github.io/postcss-d-ts/schema.json
  - *<u>./node_modules/postcss-d-ts/dist/schema.json</u>*
  - For all config file replace `schema.json` with `postconfig.schema.json`

- TypeScript

```typescript
import { Options } from "postcss-d-ts/dist/options.types"
```

- JSDoc: [./\_\_recipes\_\_/next\_10/postcss.config.js](https://github.com/askirmas/postcss-d-ts/blob/master/__recipes__/next_10/postcss.config.js)

```javascript
/** @type {{
 *  plugins: Array<
*    ["postcss-d-ts", import("postcss-d-ts/dist/options.types").Options]
 *  >
 * }}
 */
module.exports = {
  plugins: [
    ["postcss-d-ts", {}]
  ]
}
```

## Additional notes

### CLI

Simply install [`postcss-cli`] and add it to `npm scripts` with desired options: [example@cra](https://github.com/askirmas/postcss-d-ts/blob/f9f07f009a02db69d9332bdd029a95420ce1a6d9/__recipes__/create-react-app/package.json#L23) and another:

```json
// package.json
{
  "scripts": {
    "postcss-d-ts": "postcss --use postcss-d-ts styles/index.css --watch > /dev/null"
  }
}
```

### With `create-react-app`

You need to launch [postcss] as a separate process.  See commit https://github.com/askirmas/postcss-d-ts/commit/f9f07f009a02db69d9332bdd029a95420ce1a6d9 as an additional option how to establish

[postcss]: https://github.com/postcss/postcss

[postcss]: https://github.com/postcss/postcss
[`postcss`]: https://github.com/postcss/postcss-cli
[`postcss-cli`]: https://www.npmjs.com/package/postcss-cli
[`.d.ts`]: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html
