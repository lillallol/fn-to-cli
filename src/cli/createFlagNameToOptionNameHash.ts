import { parsedOption } from "../types";

export function createFlagNameToOptionNameHash(parsedOptions: parsedOption[]): { [flagName: string]: string } {
    return Object.fromEntries(
        parsedOptions.filter(({ flag }) => flag !== undefined).map(({ flag, optionName: name }) => [flag, name])
    );
}