/** @type {{
 *  plugins:
 *  {
 *    "postcss-plugin-d-ts": import("postcss-plugin-d-ts/dist/options.types").Options
 *  } | Array<[
 *    "postcss-plugin-d-ts", import("postcss-plugin-d-ts/dist/options.types").Options
 *  ]>
* }}
*/
module.exports = {
  plugins: [
    ["postcss-plugin-d-ts", {}]
  ]
}
