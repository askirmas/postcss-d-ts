/** @type {{
 *  plugins:
 *  {
 *    "postcss-d-ts": import("postcss-d-ts/dist/options.types").Options
 *  } | Array<
 *    ["postcss-d-ts", import("postcss-d-ts/dist/options.types").Options]
 *  >
* }}
*/
module.exports = {
  plugins: [
    "postcss-d-ts"
  ]
}
