import { FunctionDeclaration } from "typescript";
import { errorMessages } from "../../errorMessages";

export function throwIfFnHasNoParameters(fn: FunctionDeclaration, functionName: string): void {
    if (fn.parameters.length === 0) throw Error(errorMessages.fnToCLIHasToHaveOneParameter(functionName));
}
