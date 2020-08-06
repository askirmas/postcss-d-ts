import postcss from 'postcss';
import { jsOptions } from './options';
declare const _default: postcss.Plugin<import("./utils").Part<import("./utils").Extend<{
    crlf: string;
    destination: import("./utils").SchemaDeclaredValues<{
        default: string;
        $ref: string;
        examples: {}[];
    }>;
    type: string;
    declarationPrefix: string[];
    internalSchema: string;
    declarationPostfix: string[];
    memberSchema: string;
    identifierParser: string;
    identifierMatchIndex: number;
    memberMatcher: import("./utils").SchemaDeclaredValues<{
        title: string;
        default: string;
        type: string[];
        format: string;
        examples: null[];
    }>;
    memberInvalid: string[];
}, jsOptions>>>;
export = _default;
