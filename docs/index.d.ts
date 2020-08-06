import postcss from 'postcss';
import schema from "./schema.json";
declare type Extend<T, N> = {
    [K in Exclude<keyof T, keyof N>]: T[K];
} & {
    [K in Exclude<keyof N, keyof T>]: N[K];
} & {
    [K in keyof N & keyof T]: T[K] | N[K];
};
declare type Part<T> = {
    [P in keyof T]?: T[P];
};
declare type SchemaDeclaredValues<T extends {
    "default": any;
    "examples"?: any[];
}> = T["default"] | (T["examples"] extends any[] ? Exclude<T["examples"], undefined>[number] : T["default"]);
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
