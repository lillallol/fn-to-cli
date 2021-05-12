import { FunctionDeclaration, unescapeLeadingUnderscores } from "typescript";
import { errorMessages, internalErrorMessage } from "../errorMessages";
import { getJSDocTagValue } from "../utils";
import { constants } from "../constants";
import { _getJSDocCommentStrict } from "./getJSDocCommentStrict";

export function getCommandName(_: { fn: FunctionDeclaration }): { commandName: string; functionName: string } {
    const { fn } = _;
    const { cliJsDocTagName } = constants;
    const { cliJsDocValueValidPattern } = constants;
    const { name } = fn;

    /**
     * @description
     * An internal library error is thrown here because the function that have been chosen
     * when searching the `.d.ts` files are checked to be with names.
     */
    if (name === undefined) throw Error(internalErrorMessage.internalLibraryErrorMessage);
    const fnName: string = unescapeLeadingUnderscores(name.escapedText);

    const JSDoc = _getJSDocCommentStrict({
        astNode: fn,
        commandName: fnName,
        optionName: undefined,
    });
    const cli = getJSDocTagValue(JSDoc, cliJsDocTagName);
    const cliValue = cli[0];
    if (cli.length === 0) {
        /**
         * This is an internal error. That is because it is not possible to get a function without cli js doc tag.
         */
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    }
    if (cli.length > 1) {
        throw Error(errorMessages.moreThanOneJsDocCliTags({ fnName }));
    }
    if (cli.length === 1 && cliValue === null) {
        return {
            commandName: fnName,
            functionName: fnName,
        };
    }
    if (cli.length === 1 && typeof cliValue === "string" && !cliJsDocValueValidPattern.test(cliValue)) {
        throw Error(
            errorMessages.invalidPatternForCliJsDocTagValue({
                cliValue,
                fnName,
            })
        );
    }
    if (cli.length === 1 && typeof cliValue === "string" && cliJsDocValueValidPattern.test(cliValue)) {
        return {
            commandName: cliValue,
            functionName: fnName,
        };
    }
    throw Error(internalErrorMessage.internalLibraryErrorMessage);
}
