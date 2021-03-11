import { FunctionDeclaration } from "typescript";
import { getCommandJSDocCommentStrict } from "../getJSDocCommentStrict";
import { _getDescription } from "./getDescription";

/**
 * @description
 * It also validates that the description is well defined.
 */
export function getCommandDescription(_: {
    commandName: string;
    fn: FunctionDeclaration;
    absolutePathToInput: string;
}): string {
    const { absolutePathToInput, fn, commandName } = _;
    const JSDoc = getCommandJSDocCommentStrict({ absolutePathToInput, fn });
    return _getDescription({
        JSDoc,
        commandName,
        optionName: undefined,
        absolutePathToInput,
    });
}
