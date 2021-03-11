import { JSDoc } from "typescript";
import { getJSDocTagValue, getJSDocTagLessValue, tagUnindent, internalLibraryErrorMessage } from "../../utils/index";

export function _getDescription(_: {
    commandName: string;
    optionName: string | undefined;
    JSDoc: JSDoc;
    absolutePathToInput: string;
}): string {
    const { absolutePathToInput, commandName, optionName, JSDoc } = _;

    const tagFullDescriptions: (string | null)[] = getJSDocTagValue(JSDoc, "description");
    const tagFullDescriptionValue: string | null = (() => {
        if (tagFullDescriptions.length === 0) return null; // no description tag
        if (tagFullDescriptions.length > 1) {
            throw Error(
                _errorMessages.astNodeHasMoreThanOneJSDocDescriptionTags({
                    commandName,
                    optionName,
                    absolutePathToInput,
                })
            );
        }
        if (tagFullDescriptions.length === 1) return tagFullDescriptions[0]; //description tag without value
        throw Error(internalLibraryErrorMessage);
    })();
    const tagLessDescriptionValue: string | null = getJSDocTagLessValue(JSDoc);
    if (tagLessDescriptionValue !== null && tagFullDescriptionValue !== null) {
        throw Error(
            _errorMessages.astNodeHasBothATagLessAndTagFullDescription({
                optionName,
                commandName,
                absolutePathToInput,
            })
        );
    }
    const descriptionValue = tagLessDescriptionValue ?? tagFullDescriptionValue;
    if (descriptionValue === null) {
        throw Error(_errorMessages.astNodeHasNoJSDocDescriptionValue({ commandName, optionName, absolutePathToInput }));
    }

    return descriptionValue;
}

export const _errorMessages = {
    memberHasNoJSDocComment: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
        has option with name:

            ${_.optionName}
        
        that`,
        ]} does not have JSDoc comment.
    `,
    astNodeHasNoJSDocDescriptionValue: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
        has option with name:

            ${_.optionName}
        
        that`,
        ]} has no description value in its JSDoc comment.
    `,
    astNodeHasMoreThanOneJSDocDescriptionTags: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
        has option with name:

            ${_.optionName}

        that`,
        ]} has more than one JSDoc @description tags.
    `,
    astNodeHasBothATagLessAndTagFullDescription: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
        has option with name:

            ${_.optionName}
        
        that`,
        ]} has both tag less and tag full JSDoc description.
    `,
};
