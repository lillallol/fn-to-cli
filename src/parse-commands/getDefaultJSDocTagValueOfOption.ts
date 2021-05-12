import { getJSDocTagValue } from "../utils/index";
import { JSDoc } from "typescript";
import { errorMessages, internalErrorMessage } from "../errorMessages";
import { constants } from "../constants";

export function getDefaultJSDocTagValueOfOption(_: {
    JSDoc: JSDoc;
    commandName: string;
    isOptional: boolean;
    optionName: string;
}): string | undefined {
    const { optionName, commandName, isOptional, JSDoc } = _;
    const { defaultJsDocTagName } = constants;
    const defaultJSDocTagValues = getJSDocTagValue(JSDoc, defaultJsDocTagName);
    const hasNoDefaultJSDocTag = defaultJSDocTagValues.length === 0;
    const hasDefaultJSDocTag = !hasNoDefaultJSDocTag;
    const hasMoreThanOneDefaultJSDocTag = defaultJSDocTagValues.length > 1;
    const isNotOptional = !isOptional;
    const defaultJSDocTagValue = defaultJSDocTagValues[0];

    if (hasMoreThanOneDefaultJSDocTag) {
        throw Error(errorMessages.propertyHasMoreThanOneDefaultJSDocTagsInMember(optionName, commandName));
    }
    if (isOptional && hasNoDefaultJSDocTag) {
        throw Error(errorMessages.optionalPropertyHasNoDefaultJSDocTag(optionName, commandName));
    }
    if (isNotOptional && hasDefaultJSDocTag) {
        throw Error(errorMessages.nonOptionalPropertyHasDefaultJSDocTag(optionName, commandName));
    }
    if (isNotOptional && hasNoDefaultJSDocTag) {
        return undefined;
    }

    if (isOptional && hasDefaultJSDocTag && defaultJSDocTagValue === null) {
        if (defaultJSDocTagValue === null) {
            throw Error(
                errorMessages.optionalOptionHasNoValueForDefaultJSDocTag({
                    commandName,
                    optionName,
                })
            );
        }
    }

    if (isOptional && hasDefaultJSDocTag && typeof defaultJSDocTagValue === "string") {
        return defaultJSDocTagValue;
    }

    throw Error(internalErrorMessage.internalLibraryErrorMessage);
}
