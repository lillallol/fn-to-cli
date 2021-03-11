import { parsedOption } from "../types";

export function createFlagNamesHash(options: parsedOption[]): { [flagName: string]: boolean } {
    return Object.fromEntries(options.filter(({ flag }) => flag !== undefined).map(({ flag }) => [flag, true]));
}