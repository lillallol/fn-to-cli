import { FunctionDeclaration, JSDoc, TypeElement } from "typescript";
import { getJsDocOfAstNode } from "../utils/index";
import { errorMessages, internalErrorMessage } from "../errorMessages";
import { getCommandName } from "./getCommandName";
import { getOptionName } from "./getOptionName";

export function _getJSDocCommentStrict(_: {
    astNode: TypeElement | FunctionDeclaration;
    optionName: string | undefined;
    commandName: string;
}): JSDoc {
    const { astNode, commandName, optionName } = _;
    const jsDoc = getJsDocOfAstNode(astNode);
    if (jsDoc === undefined) {
        if (optionName !== undefined) {
            throw Error(errorMessages.astNodeHasNoJSDocComment({ optionName, commandName }));
        }
        //For the following error message to occur that means that a function without jsdoc comment was picked to be
        //converted to CLI. Buw how was that function was picked without having a @CLI jsdoc tag? And this is the reason why
        //this error is an internal library error.
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    }
    if (jsDoc.length > 1) {
        throw Error(errorMessages.astNodeHasMoreThanOneJSDocComment({ optionName, commandName }));
    }
    const [JSDoc] = jsDoc;
    return JSDoc;
}

export function getCommandJSDocCommentStrict(_: { fn: FunctionDeclaration }): JSDoc {
    const { fn } = _;
    const { commandName } = getCommandName({ fn });
    return _getJSDocCommentStrict({
        astNode: fn,
        commandName,
        optionName: undefined,
    });
}

export function getOptionJSDocCommentStrict(_: { commandName: string; option: TypeElement }): JSDoc {
    const { option, commandName } = _;
    const optionName = getOptionName({ option, commandName });
    return _getJSDocCommentStrict({
        astNode: option,
        commandName,
        optionName,
    });
}
