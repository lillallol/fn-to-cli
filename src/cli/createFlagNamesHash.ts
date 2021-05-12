import { parsedOption } from "../types";

export function createFlagNamesSet(options: parsedOption[]): Set<string> {
    const flags: string[] = [];
    for (const { flag } of options) {
        if (typeof flag === "string") flags.push(flag);
    }
    return new Set(flags);
}
