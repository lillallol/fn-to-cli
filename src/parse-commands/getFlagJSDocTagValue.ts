import { JSDoc } from "typescript";
import { getJSDocTagValue } from "../utils/index";
import { tagUnindent } from "../utils/index";

export function getFlagJSDocTagValue(_: {
    JSDoc: JSDoc;
    optionName: string;
    commandName: string;
    absolutePathToFile: string;
}): string | undefined {
    const { JSDoc, commandName, optionName, absolutePathToFile } = _;

    const flags = getJSDocTagValue(JSDoc, "flag");
    if (flags.length === 0) return undefined;
    if (flags.length > 1)
        throw Error(_errorMessages.moreThanOneJSDocFlagTas({ commandName, absolutePathToFile, optionName }));
    const flag = flags[0];
    if (flag === null)
        throw Error(_errorMessages.flagJSDocTagHasNoValue({ absolutePathToFile, optionName, commandName }));
    if (flag === "h") throw Error(_errorMessages.flagHIsReserved({ commandName, absolutePathToFile }));
    if (!/^[a-z]$/.test(flag))
        throw Error(_errorMessages.flagHasToBeOneLetter({ absolutePathToFile, commandName, optionName }));
    return flag;
}

export const _errorMessages = {
    flagHIsReserved: (_: { commandName: string; absolutePathToFile: string }): string => tagUnindent`
        Command with name:
        
            ${_.commandName}

        in path:

            ${_.absolutePathToFile}

        has option with name:

           h

        that is reserved.
    `,
    moreThanOneJSDocFlagTas: (_: {
        optionName: string;
        commandName: string;
        absolutePathToFile: string;
    }): string => tagUnindent`
        Command with name:
        
            ${_.commandName}

        in path:

            ${_.absolutePathToFile}

        has option with name:

            ${_.optionName}

        that has more than one flag JSDoc tags.
    `,
    flagJSDocTagHasNoValue: (_: {
        optionName: string;
        commandName: string;
        absolutePathToFile: string;
    }): string => tagUnindent`
        Command with name:
        
            ${_.commandName}

        in path:

            ${_.absolutePathToFile}

        has option with name:

            ${_.optionName}

        that has flag JSDoc tag without value.
    `,
    flagHasToBeOneLetter: (_: {
        optionName: string;
        commandName: string;
        absolutePathToFile: string;
    }): string => tagUnindent`
        Command with name:
        
            ${_.commandName}

        in path:

            ${_.absolutePathToFile}

        has option with name:

            ${_.optionName}

        that has flag JSDoc tag with value that is not of one lowercase letter (a-z).
    `,
};
