import { FunctionDeclaration, JSDoc, TypeElement } from "typescript";
import { getJsDocOfAstNode } from "../utils/index";
import { tagUnindent } from "../utils/index";
import { getCommandName } from "./getCommandName";
import { getOptionName } from "./getOptionName";

export function _getJSDocCommentStrict(_: {
    astNode: TypeElement | FunctionDeclaration;
    absolutePathToInput: string;
    optionName: string | undefined;
    commandName: string;
}): JSDoc {
    const { absolutePathToInput, astNode, commandName, optionName } = _;
    const jsDoc = getJsDocOfAstNode(astNode);
    if (jsDoc === undefined) {
        throw Error(_errorMessages.astNodeHasNoJSDocComment({ optionName, commandName, absolutePathToInput }));
    }
    if (jsDoc.length > 1) {
        throw Error(_errorMessages.astNodeHasMoreThanOneJSDocComment({ optionName, commandName, absolutePathToInput }));
    }
    const [JSDoc] = jsDoc;
    return JSDoc;
}

export function getCommandJSDocCommentStrict(_: { fn: FunctionDeclaration; absolutePathToInput: string }): JSDoc {
    const { absolutePathToInput, fn } = _;
    const commandName = getCommandName(fn);
    return _getJSDocCommentStrict({
        astNode: fn,
        absolutePathToInput,
        commandName,
        optionName: undefined,
    });
}

export function getOptionJSDocCommentStrict(_: {
    commandName: string;
    option: TypeElement;
    absolutePathToInput: string;
}): JSDoc {
    const { absolutePathToInput, option, commandName } = _;
    const optionName = getOptionName(option);
    return _getJSDocCommentStrict({
        astNode: option,
        commandName,
        optionName,
        absolutePathToInput,
    });
}

//@TODO are these error messages formatted properly?
export const _errorMessages = {
    astNodeHasNoJSDocComment: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}
        
        ${
            _.optionName === undefined
                ? ""
                : [
                      tagUnindent`
        has option of name:

            ${_.optionName}

        that`,
                  ]
        } does not have JSDoc comment.
    `,
    astNodeHasMoreThanOneJSDocComment: (_: {
        commandName: string;
        optionName: string | undefined;
        absolutePathToInput: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        in path:

            ${_.absolutePathToInput}
        
        ${
            _.optionName === undefined
                ? ""
                : [
                      tagUnindent`
        has option of name:

            ${_.optionName}

        that`,
                  ]
        } has more than one JSDoc comment.
    `,
};
