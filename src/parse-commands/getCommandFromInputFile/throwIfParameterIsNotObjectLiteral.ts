import { FunctionDeclaration, isTypeLiteralNode, TypeLiteralNode } from "typescript";
import { tagUnindent } from "../../utils/index";

/**
 * @description
 * It validates also.
*/
export function throwIfParameterIsNotObjectLiteral(fnStatementToCLI : FunctionDeclaration) : TypeLiteralNode {
    const { type: fnToCLIParameters0Type } = fnStatementToCLI.parameters[0];
    if (fnToCLIParameters0Type === undefined || !isTypeLiteralNode(fnToCLIParameters0Type)) {
        throw Error(_errorMessages.invalidTypeParameterForFunctionConvertToCLI);
    }
    return fnToCLIParameters0Type;
}

export const _errorMessages = {
    invalidTypeParameterForFunctionConvertToCLI: tagUnindent`
        Function to convert to CLI has to have its single parameter with object literal type.
    `,
};