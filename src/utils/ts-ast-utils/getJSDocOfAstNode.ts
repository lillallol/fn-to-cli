import { JSDoc, Node } from "typescript";
import { internalLibraryErrorMessage } from "../es-utils/internalLibraryErrorMessage";

/**
 * @description
 * If it returns an array then this is not a zero length array.
 */
export function getJsDocOfAstNode(astNode: Node): JSDoc[] | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { jsDoc } = astNode;
    //@TODO the check should be more strict
    if ((jsDoc !== undefined && !Array.isArray(jsDoc)) || (Array.isArray(jsDoc) && jsDoc.length === 0)) {
        throw Error(internalLibraryErrorMessage);
    }
    return jsDoc;
}
