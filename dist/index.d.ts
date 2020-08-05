/// <reference path="../src/ts-swiss.d.ts" />
import postcss from 'postcss';
import schema from "./schema.json";
declare type SchemaOptions = typeof schema;
declare type DefOptions = {
    [K in keyof SchemaOptions["properties"]]: SchemaDeclaredValues<SchemaOptions["properties"][K]>;
};
declare type jsOptions = {
    identifierParser: RegExp;
    memberMatcher: RegExp;
    destination: Record<string, string[]>;
};
export declare type PostCssPluginDTsOptions = Part<Extend<DefOptions, jsOptions>>;
declare const _default: postcss.Plugin<Part<Extend<DefOptions, jsOptions>>>;
export default _default;
