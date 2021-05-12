import { FunctionDeclaration, isFunctionDeclaration, Statement, TypeLiteralNode } from "typescript";
import { getJsDocOfAstNode, getStatementsOf } from "../../utils/index";
import { hasJSDocTagOfName } from "../../utils/index";
import { errorMessages } from "../../errorMessages";
import { throwIfFnHasMoreThanOneParameters } from "./throwIfFnHasMoreThanOneParameters";
import { throwIfFnHasNoParameters } from "./throwIfFnHasNoParameters";
import { throwIfInputCanNotBeAccessed } from "./throwIfInputCanNotBeAccessed";
import { getParameterAstNode } from "./getParameter";

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

    return fns.map((fn) => {
        const { name: functionNameIdentifier } = fn;
        if (functionNameIdentifier === undefined) {
            throw Error(errorMessages.commandHasNoName(absolutePathToInputFile));
        }
        const functionName = functionNameIdentifier.text;

        throwIfFnHasNoParameters(fn, functionName);
        throwIfFnHasMoreThanOneParameters(fn, functionName);
        const parameter = getParameterAstNode(fn,functionName);

        return {
            fn,
            parameter
        }
    });
}

function isFunctionDeclarationWithJSDocTagCLI(s: Statement): s is FunctionDeclaration {
    const jsDoc = getJsDocOfAstNode(s);
    if (jsDoc === undefined) return false;
    return isFunctionDeclaration(s) && hasJSDocTagOfName(jsDoc[0], "CLI");
}
