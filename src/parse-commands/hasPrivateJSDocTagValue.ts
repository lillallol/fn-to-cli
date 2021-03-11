import { JSDoc } from "typescript";
import { getJSDocTagValue, internalLibraryErrorMessage } from "../utils/index";
import { tagUnindent } from "../utils/index";

export function hasPrivateJSDocTagValue(
    JSDoc: JSDoc,
    isOptional: boolean,
    commandName: string,
    optionName: string
): boolean {
    const privateValues = getJSDocTagValue(JSDoc, "private");

    // no private JSDoc tags
    if (privateValues.length === 0) return false;
    // more than one private JSDoc tag
    if (privateValues.length > 1) throw Error(_errorMessages.moreThanOnePrivateJSDocTag(commandName, optionName));
    // one private JSDoc tag with no value for optional property
    if (privateValues.length === 1 && privateValues[0] === null && isOptional) return true;
    // one private JSDoc tag with no value for non optional property
    if (privateValues.length === 1 && privateValues[0] === null && !isOptional) {
        throw Error(_errorMessages.nonOptionalOptionCanNotBePrivate(commandName, optionName));
    }
    // one private JSDoc tag with value
    if (privateValues.length === 1 && privateValues[0] !== null) {
        throw Error(_errorMessages.privateJSDocTagHasValue(commandName, optionName, privateValues[0]));
    }

    throw Error(internalLibraryErrorMessage);
}

export const _errorMessages = {
    moreThanOnePrivateJSDocTag: (commandName: string, optionName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that has more that one private JSDoc tags.
    `,
    nonOptionalOptionCanNotBePrivate: (commandName: string, optionName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that is not optional and has private JSDoc tag. You have to either mke it optional or remove the private JSDoc tag.
    `,
    privateJSDocTagHasValue: (
        commandName: string,
        optionName: string,
        privateJSDocTagValue: string
    ): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that has private JSDoc tag, with value:

            ${privateJSDocTagValue}

        while it has to have no value.
    `,
};
