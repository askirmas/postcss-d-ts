import { SchemaDeclaredValues, Part, Extend } from './utils';
import schema from "./schema.json";
declare type SchemaOptions = typeof schema;
declare type DefOptions = {
    [K in keyof SchemaOptions["properties"]]: SchemaDeclaredValues<SchemaOptions["properties"][K]>;
};
export declare type jsOptions = {
    identifierParser: RegExp;
    memberMatcher: RegExp;
    destination: Record<string, string[]>;
};
export declare type Options = Part<Extend<DefOptions, jsOptions>>;
export {};
