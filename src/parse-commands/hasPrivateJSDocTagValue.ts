import { JSDoc } from "typescript";
import { getJSDocTagValue } from "../utils/index";
import { errorMessages, internalErrorMessage } from "../errorMessages";
import { constants } from "../constants";

export function hasPrivateJSDocTagValue(
    JSDoc: JSDoc,
    isOptional: boolean,
    commandName: string,
    optionName: string
): boolean {
    const { cliPrivateJsDocTagName } = constants;
    const privateValues = getJSDocTagValue(JSDoc, cliPrivateJsDocTagName);

    // no private JSDoc tags
    if (privateValues.length === 0) return false;
    // more than one private JSDoc tag
    if (privateValues.length > 1) throw Error(errorMessages.moreThanOnePrivateJSDocTag(commandName, optionName));
    // one private JSDoc tag with no value for optional property
    if (privateValues.length === 1 && privateValues[0] === null && isOptional) return true;
    // one private JSDoc tag with no value for non optional property
    if (privateValues.length === 1 && privateValues[0] === null && !isOptional) {
        throw Error(errorMessages.nonOptionalOptionCanNotBePrivate(commandName, optionName));
    }
    // one private JSDoc tag with value
    if (privateValues.length === 1 && privateValues[0] !== null) {
        throw Error(errorMessages.privateJSDocTagHasValue(commandName, optionName, privateValues[0]));
    }

    throw Error(internalErrorMessage.internalLibraryErrorMessage);
}
