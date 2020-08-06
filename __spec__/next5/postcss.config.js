/** @type {{
 *  plugins:
 *  {
 *    "postcss-plugin-d-ts": import("postcss-plugin-d-ts/dist/options").Options
 *  } | Array<[
 *    "postcss-plugin-d-ts", import("postcss-plugin-d-ts/dist/options").Options
 *  ]>
* }}
*/
module.exports = {
  plugins: [
    ["postcss-plugin-d-ts", {}]
  ]
}
