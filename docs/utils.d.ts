export declare type Extend<T, N> = {
    [K in Exclude<keyof T, keyof N>]: T[K];
} & {
    [K in Exclude<keyof N, keyof T>]: N[K];
} & {
    [K in keyof N & keyof T]: T[K] | N[K];
};
export declare type Part<T> = {
    [P in keyof T]?: T[P];
};
declare type DefaultsAndExamples = {
    "default": any;
    "examples"?: any[];
};
declare type SchemaWithDefaultsAndExamples = {
    "properties": Record<string, DefaultsAndExamples>;
};
export declare type SchemaDeclaredValues<T extends DefaultsAndExamples> = T["default"] | (T["examples"] extends any[] ? Exclude<T["examples"], undefined>[number] : T["default"]);
declare type DefaultsAndExamplesFromSchema<S extends SchemaWithDefaultsAndExamples> = {
    [K in keyof S["properties"]]: SchemaDeclaredValues<S["properties"][K]>;
};
export { templating, regexpize, extractDefaults };
declare function templating(template: string, map: Record<string, string>): string;
declare function templating(template: string[], map: Record<string, string>): string[];
declare function regexpize(source: string | RegExp, flags?: string): RegExp;
declare function extractDefaults<S extends SchemaWithDefaultsAndExamples>({ properties }: S): DefaultsAndExamplesFromSchema<S>;
