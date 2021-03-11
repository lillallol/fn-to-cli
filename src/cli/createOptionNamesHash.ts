import { parsedOption } from "../types";

export function createOptionNamesHash(options: parsedOption[]): { [optionName: string]: boolean } {
    return Object.fromEntries(options.map(({ optionName: name }) => [name, true]));
}