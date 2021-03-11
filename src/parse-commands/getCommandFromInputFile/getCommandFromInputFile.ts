import { FunctionDeclaration, isFunctionDeclaration, Statement, TypeLiteralNode } from "typescript";
import { getJsDocOfAstNode, getStatementsOf, tagUnindent } from "../../utils/index";
import { hasJSDocTagOfName } from "../../utils/index";
import { throwIfFnHasMoreThanOneParameters } from "./throwIfFnHasMoreThanOneParameters";
import { throwIfFnHasNoParameters } from "./throwIfFnHasNoParameters";
import { throwIfInputCanNotBeAccessed } from "./throwIfInputCanNotBeAccessed";
import { throwIfParameterIsNotObjectLiteral } from "./throwIfParameterIsNotObjectLiteral";

/**
 * @description
 * If the path to provided ts file has functions with `@CLI` tag, it returns
 * their function statement and parameter as ast nodes.
 *
 * It throws if the file can not be accessed.
 */
export function getCommandFromInputFileSoft(_: {
    /**
     * @description
     * Absolute path to the file of function to CLI-fy.
     */
    absolutePathToInputFile: string;
}): {
    /**
     * @description
     * Function to CLI-fy.
     */
    fn: FunctionDeclaration;
    /**
     * @description
     * The single parameter of the function to CLI-fy.
     */
    parameter: TypeLiteralNode;
}[] {
    const { absolutePathToInputFile } = _;

    throwIfInputCanNotBeAccessed(absolutePathToInputFile);

    const fns = getStatementsOf(absolutePathToInputFile).filter(isFunctionDeclarationWithJSDocTagCLI);

    fns.forEach((fn) => {
        const { name: functionNameIdentifier } = fn;
        if (functionNameIdentifier === undefined) {
            throw Error(_errorMessages.functionHasNoName(absolutePathToInputFile));
        }
        const functionName = functionNameIdentifier.text;

        throwIfFnHasNoParameters(fn, absolutePathToInputFile, functionName);
        throwIfFnHasMoreThanOneParameters(fn, absolutePathToInputFile, functionName);
    });

    return fns.map((fn) => ({
        fn: fn,
        parameter: throwIfParameterIsNotObjectLiteral(fn),
    }));
}

function isFunctionDeclarationWithJSDocTagCLI(s: Statement): s is FunctionDeclaration {
    const jsDoc = getJsDocOfAstNode(s);
    if (jsDoc === undefined) return false;
    return isFunctionDeclaration(s) && hasJSDocTagOfName(jsDoc[0], "CLI");
}

export const _errorMessages = {
    functionHasNoName: (absolutePathToInputFile: string): string => tagUnindent`
        In path:

            ${absolutePathToInputFile}

        there is a function with @CLI JSDoc that has no name.

        Add a name to the function.
    `,
};
