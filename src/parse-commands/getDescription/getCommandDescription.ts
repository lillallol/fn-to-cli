import { FunctionDeclaration } from "typescript";
import { getCommandJSDocCommentStrict } from "../getJSDocCommentStrict";
import { _getDescription } from "./getDescription";

/**
 * @description
 * It also validates that the description is well defined.
 */
export function getCommandDescription(_: { commandName: string; fn: FunctionDeclaration }): string {
    const { fn, commandName } = _;
    const JSDoc = getCommandJSDocCommentStrict({ fn });
    return _getDescription({
        JSDoc,
        commandName,
        optionName: undefined,
    });
}
