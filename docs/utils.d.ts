export { templating, regexpize };
declare function templating(template: string, map: Record<string, string>): string;
declare function templating(template: string[], map: Record<string, string>): string[];
declare function regexpize(source: string | RegExp, flags?: string): RegExp;
