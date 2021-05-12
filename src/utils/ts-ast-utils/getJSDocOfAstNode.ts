import { JSDoc, Node } from "typescript";
import { internalErrorMessage } from "../../errorMessages";

/**
 * @description
 * If it returns an array then this is not a zero length array.
 */
export function getJsDocOfAstNode(astNode: Node): JSDoc[] | undefined {
    //@ts-ignore
    const { jsDoc } = astNode;
    if (jsDoc !== undefined && !Array.isArray(jsDoc)) {
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    }
    return jsDoc;
}
