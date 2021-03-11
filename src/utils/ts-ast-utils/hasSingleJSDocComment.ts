import { Node } from "typescript";
import { getJsDocOfAstNode } from "./getJSDocOfAstNode";

export function hasSingleJSDocComment(astNode: Node): boolean {
    const toReturn = getJsDocOfAstNode(astNode);
    if (toReturn === undefined) return false;
    if (toReturn.length !== 1) return false;
    return true;
}
