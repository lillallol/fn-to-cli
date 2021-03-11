import { parsedOption } from "../types";

export function createRequiredOptionNameHash(parsedOptions: parsedOption[]): { [requiredOptionName: string]: boolean } {
    const requiredOptionNameHash: { [requiredOptionName: string]: boolean } = {};
    for (const { isOptional, optionName: name } of parsedOptions) {
        if (!isOptional) requiredOptionNameHash[name] = true;
    }
    return requiredOptionNameHash;
}
