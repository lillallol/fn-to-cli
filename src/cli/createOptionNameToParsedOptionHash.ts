import { parsedOption } from "../types";

export function createOptionNameToParsedOptionHash(parsedOptions : parsedOption[]) : {[optionName : string] : parsedOption} {
    const toReturn : {[optionName : string] : parsedOption} = {};
    parsedOptions.forEach((parsedOption) => {
        const {optionName: name} = parsedOption;
        toReturn[name] = parsedOption;
    })
    return toReturn;
}