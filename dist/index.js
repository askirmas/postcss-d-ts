"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="ts-swiss.d.ts"/>
const postcss_1 = __importDefault(require("postcss"));
const util_1 = require("util");
const fs_1 = require("fs");
const readline_1 = require("readline");
const utils_1 = require("./utils");
const schema_json_1 = __importDefault(require("./schema.json"));
const { entries: $entries, fromEntries: $fromEntries } = Object, $exists = util_1.promisify(fs_1.exists), defaultOptions = $fromEntries($entries(schema_json_1.default.properties)
    .map(([key, { "default": $def }]) => [key, $def]));
exports.default = postcss_1.default.plugin('postcss-plugin-css-d-ts', (opts) => {
    const { crlf, declarationPrefix, declarationPostfix, identifierParser: ip, memberMatcher: mm, identifierMatchIndex, destination, internalSchema, memberSchema, type, memberInvalid } = Object.assign(Object.assign({}, defaultOptions), opts) // WithDefault<Options, DefOptions>
    , identifierParser = utils_1.regexpize(ip, "g"), memberMatcher = mm && utils_1.regexpize(mm), notAllowedMember = new Set(memberInvalid);
    return (root, result) => __awaiter(void 0, void 0, void 0, function* () {
        var e_1, _a;
        var _b, _c;
        if (!destination)
            return result.warn("Destination is falsy");
        //TODO check sticky
        if (!identifierParser.flags.includes('g'))
            return result.warn('identifierParser should have global flag');
        /* istanbul ignore next //TODO read postcss documentation */
        const { file } = (_c = (_b = root.source) === null || _b === void 0 ? void 0 : _b.input) !== null && _c !== void 0 ? _c : {};
        if (!file)
            // TODO To common place?
            return; //result.warn("Destination is falsy")
        const oFile = { file }, names = new Set(), properties = [], members = [];
        root.walkRules(({ selectors }) => {
            //TODO consider postcss-selector-parser
            const { length } = selectors;
            for (let i = length; i--;) {
                const selector = selectors[i];
                let identifier;
                // TODO check that parser is moving
                while (identifier = identifierParser.exec(selector)) {
                    identifier = identifier[identifierMatchIndex];
                    if (names.has(identifier))
                        continue;
                    const voc = { identifier, type };
                    names.add(identifier);
                    properties.push(utils_1.templating(internalSchema, voc));
                    if (memberMatcher
                        && !notAllowedMember.has(identifier)
                        && memberMatcher.test(identifier))
                        members.push(utils_1.templating(memberSchema, voc));
                }
            }
        });
        const lines = [
            utils_1.templating(declarationPrefix, oFile),
            properties,
            utils_1.templating(declarationPostfix, oFile),
            members
        ].reduce((x, y) => x.concat(y)), { length } = lines;
        writing: if (typeof destination === "string") {
            const filename = utils_1.templating(destination, oFile);
            if (yield $exists(filename)) {
                const lineReader = readline_1.createInterface(fs_1.createReadStream(filename));
                let i = 0, isSame = true;
                try {
                    for (var lineReader_1 = __asyncValues(lineReader), lineReader_1_1; lineReader_1_1 = yield lineReader_1.next(), !lineReader_1_1.done;) {
                        const line = lineReader_1_1.value;
                        if (!(isSame = line === lines[i++]))
                            break;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (lineReader_1_1 && !lineReader_1_1.done && (_a = lineReader_1.return)) yield _a.call(lineReader_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (isSame && i === length)
                    break writing;
            }
            const stream = fs_1.createWriteStream(filename);
            yield new Promise((res, rej) => {
                stream.on('error', rej).on('finish', res);
                for (let i = 0; i < length; i++)
                    stream.write(`${lines[i]}${crlf}`, 
                    /* istanbul ignore next */
                    err => err && rej(err));
                stream.end();
            });
        }
        else
            // TODO Somehow get rid of `{}`
            destination[utils_1.templating(file, oFile)] = lines;
    });
});
