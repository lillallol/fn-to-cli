import { FunctionDeclaration, isTypeLiteralNode, TypeLiteralNode } from "typescript";
import { errorMessages } from "../../errorMessages";

/**
 * @description
 * It validates also.
*/
export function getParameterAstNode(fnStatementToCLI : FunctionDeclaration,fnName : string) : TypeLiteralNode {
    const { type: fnToCLIParameters0Type } = fnStatementToCLI.parameters[0];

    if (fnToCLIParameters0Type === undefined || !isTypeLiteralNode(fnToCLIParameters0Type)) {
        throw Error(errorMessages.invalidTypeParameterForFunctionConvertToCLI(fnName));
    }
    return fnToCLIParameters0Type;
}