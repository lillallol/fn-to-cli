import { JSDoc } from "typescript";
import { getJSDocTagValue } from "../utils/index";
import { errorMessages } from "../errorMessages";
import { constants } from "../constants";

export function getFlagJSDocTagValue(_: {
    JSDoc: JSDoc;
    optionName: string;
    commandName: string;
    absolutePathToFile: string;
}): string | undefined {
    const { JSDoc, commandName, optionName } = _;
    const { flagJsDocTagName } = constants;
    const { reservedFlagNames, flagJsDocValueValidPattern } = constants;
    const flags = getJSDocTagValue(JSDoc, flagJsDocTagName);
    if (flags.length === 0) return undefined;
    if (flags.length > 1) throw Error(errorMessages.moreThanOneJSDocFlagTag({ commandName, optionName }));
    const flagName = flags[0];
    if (flagName === null) throw Error(errorMessages.flagJSDocTagHasNoValue({ optionName, commandName }));
    if (!flagJsDocValueValidPattern.test(flagName)) {
        throw Error(errorMessages.flagHasToBeOneLetter({ commandName, optionName }));
    }

    if (reservedFlagNames.includes(flagName)) {
        throw Error(
            errorMessages.providedFlagNameIsReserved({
                commandName,
                flagName,
                optionName,
            })
        );
    }
    return flagName;
}
