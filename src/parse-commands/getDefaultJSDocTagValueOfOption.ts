import { getJSDocTagValue, internalLibraryErrorMessage } from "../utils/index";
import { tagUnindent } from "../utils/index";
import { optionTypeAsStringUnion, optionTypeUnion } from "../types";
import { JSDoc } from "typescript";

export function getDefaultJSDocTagValueOfOption(_: {
    JSDoc: JSDoc;
    absolutePathToInput: string;
    type: optionTypeAsStringUnion;
    commandName: string;
    isOptional: boolean;
    optionName: string;
}): optionTypeUnion | undefined {
    const { absolutePathToInput, optionName, type, commandName, isOptional, JSDoc } = _;

    const defaultJSDocTagValues = getJSDocTagValue(JSDoc, "default");
    const hasNoDefaultJSDocTag = defaultJSDocTagValues.length === 0;
    const hasDefaultJSDocTag = !hasNoDefaultJSDocTag;
    const hasMoreThanOneDefaultJSDocTag = defaultJSDocTagValues.length > 1;
    const isNotOptional = !isOptional;

    if (hasMoreThanOneDefaultJSDocTag) {
        throw Error(
            _errorMessages.propertyHasMoreThanOneDefaultJSDocTagsInMember(optionName, commandName, absolutePathToInput)
        );
    }
    if (isOptional && hasNoDefaultJSDocTag) {
        throw Error(_errorMessages.optionalPropertyHasNoDefaultJSDocTag(optionName, commandName, absolutePathToInput));
    }
    if (isNotOptional && hasDefaultJSDocTag) {
        throw Error(_errorMessages.nonOptionalPropertyHasDefaultJSDocTag(optionName, commandName, absolutePathToInput));
    }
    if (isNotOptional && hasNoDefaultJSDocTag) {
        return undefined;
    }

    // @TODO maybe make that a function in a separate file
    if (isOptional && hasDefaultJSDocTag) {
        const defaultJSDocTagValue = defaultJSDocTagValues[0];
        if (defaultJSDocTagValue === null) throw Error(internalLibraryErrorMessage);

        const defaultValue = (() => {
            try {
                return JSON.parse(defaultJSDocTagValue);
            } catch {
                throw Error(
                    _errorMessages.nonSerializableDefaultJSDocTagValue(
                        optionName,
                        defaultJSDocTagValue,
                        commandName,
                        absolutePathToInput
                    )
                );
            }
        })();
        if (Array.isArray(defaultValue) && type.endsWith("[]")) {
            const arrayElementType = type.slice(0, -2);
            for (let i = 1; i < defaultValue.length; i++) {
                if (arrayElementType !== typeof defaultValue[i])
                    throw Error(
                        _errorMessages.arrayHasElementOfWrongType(
                            commandName,
                            absolutePathToInput,
                            optionName,
                            i,
                            typeof defaultValue[i],
                            type
                        )
                    );
            }
        } else if ((Array.isArray(defaultValue) && !type.endsWith("[]")) || typeof defaultValue !== type) {
            throw Error(
                _errorMessages.invalidTypeForParsedDefaultJSDocTagValue(
                    optionName,
                    defaultJSDocTagValue,
                    type,
                    commandName,
                    absolutePathToInput
                )
            );
        }
        return defaultValue;
    }
    throw Error(internalLibraryErrorMessage);
}

export const _errorMessages = {
    memberHasNoJSDocComment: (
        identifierName: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:

            ${identifierName}

        does not have JSDoc comment.
    `,
    optionalPropertyHasNoDefaultJSDocTag: (
        identifierName: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:

            ${identifierName}

        has no default JSDoc tag, while it is optional.
    `,
    nonOptionalPropertyHasDefaultJSDocTag: (
        identifierName: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:
    
            ${identifierName}
    
        has default JSDoc tag, while it is not optional.
    `,
    propertyHasMoreThanOneDefaultJSDocTagsInMember: (
        identifierName: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:
        
            ${identifierName}

        has more than one @default JSDoc tags.
    `,
    nonSerializableDefaultJSDocTagValue: (
        name: string,
        defaultJSDocTagValue: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:

            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:

            ${name}

        has default JSDoc tag value:

            ${defaultJSDocTagValue}

        that is not JSON serializable,
    `,
    invalidTypeForParsedDefaultJSDocTagValue: (
        name: string,
        defaultJSDocTagValue: optionTypeUnion,
        type: optionTypeAsStringUnion,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        For the command with name:

            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:

            ${name}

        has default JSDoc tag value:

            ${String(defaultJSDocTagValue)}

        that is not of type:

            ${type}

        as it has to be.
    `,
    arrayHasElementOfWrongType: (
        commandName: string,
        absolutePathToInput: string,
        optionName: string,
        i: number,
        badType: string,
        type: string
    ): string => tagUnindent`
        For the command with name:
    
            ${commandName}

        in path:

            ${absolutePathToInput}

        its option with name:

            ${optionName}

        has array element in index:
        
            ${i}

        that has type: 
        
            ${badType}
        
        which is not defined type:

            ${type}

    `,
};
