import { FunctionDeclaration } from "typescript";
import { errorMessages } from "../../errorMessages";

export function throwIfFnHasMoreThanOneParameters(fn: FunctionDeclaration, functionName: string): void {
    if (fn.parameters.length > 1) throw Error(errorMessages.fnToCLIHasToHaveOneParameter(functionName));
}
