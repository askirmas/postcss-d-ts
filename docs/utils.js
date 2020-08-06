"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDefaults = exports.regexpize = exports.templating = void 0;
// </ts-swiss>
const { isArray: $isArray } = Array, { keys: $keys } = Object;
function templating(template, map) {
    const templates = $isArray(template) ? template : [template], { length } = templates, output = new Array(length);
    for (let i = length; i--;) {
        let result = templates[i];
        for (const word in map)
            // TODO check each and throw 'no option'
            result = result.replace(`\${${word}}`, map[word]);
        output[i] = result;
    }
    return $isArray(template) ? output : output[0];
}
exports.templating = templating;
function regexpize(source, flags = "") {
    return typeof source === "string"
        ? new RegExp(source, flags)
        : source;
}
exports.regexpize = regexpize;
function extractDefaults({ properties }) {
    const keys = $keys(properties), { length } = keys, defaults = {};
    for (let i = length; i--;) {
        const key = keys[i];
        //@ts-ignore
        defaults[key] = properties[key].default;
    }
    return defaults;
}
exports.extractDefaults = extractDefaults;
