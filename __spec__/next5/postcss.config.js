/** @type {{
 *  plugins:
 *  {
 *    "postcss-plugin-d-ts": import("postcss-plugin-d-ts/docs/options").Options
 *  } | Array<[
 *    "postcss-plugin-d-ts", import("postcss-plugin-d-ts/docs/options").Options
 *  ]>
* }}
*/
module.exports = {
  plugins: [
    ["postcss-plugin-d-ts", {}]
  ]
}
