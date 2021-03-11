import { parsedOption } from "../types";

export function createOptionNameToFlagNameHash(parsedOptions : parsedOption[]): {[optionName : string] : string} {
    const toReturn : {[optionName : string] : string} = {};
    parsedOptions.forEach(({optionName: name,flag}) => {
        if (flag !== undefined) {
            toReturn[name] = flag;
        }
    });
    return toReturn;
}