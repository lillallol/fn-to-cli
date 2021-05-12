import { JSDoc } from "typescript";
import { getJSDocTagValue, getJSDocTagLessValue } from "../../utils/index";
import { errorMessages, internalErrorMessage } from "../../errorMessages";
import { constants } from "../../constants";

export function _getDescription(_: { commandName: string; optionName: string | undefined; JSDoc: JSDoc }): string {
    const { commandName, optionName, JSDoc } = _;
    const { descriptionJsDocTagName } = constants;
    const tagFullDescriptions: (string | null)[] = getJSDocTagValue(JSDoc, descriptionJsDocTagName);
    const tagFullDescriptionValue: string | null = (() => {
        if (tagFullDescriptions.length === 0) return null; // no description tag
        if (tagFullDescriptions.length > 1) {
            throw Error(
                errorMessages.astNodeHasMoreThanOneJSDocDescriptionTags({
                    commandName,
                    optionName,
                })
            );
        }
        if (tagFullDescriptions.length === 1) return tagFullDescriptions[0]; //description tag without value
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    })();
    const tagLessDescriptionValue: string | null = getJSDocTagLessValue(JSDoc);
    if (tagLessDescriptionValue !== null && tagFullDescriptionValue !== null) {
        throw Error(
            errorMessages.astNodeHasBothATagLessAndTagFullDescription({
                optionName,
                commandName,
            })
        );
    }
    const descriptionValue = tagLessDescriptionValue ?? tagFullDescriptionValue;
    if (descriptionValue === null) {
        throw Error(errorMessages.astNodeHasNoJSDocDescriptionValue({ commandName, optionName }));
    }

    return descriptionValue;
}
