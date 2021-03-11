import { FunctionDeclaration } from "typescript";
import { tagUnindent } from "../../utils/index";

export function throwIfFnHasMoreThanOneParameters(fn: FunctionDeclaration, path: string, functionName: string): void {
    if (fn.parameters.length > 1) throw Error(_errorMessages.fnToCLIHasToHaveOneParameter(path, functionName));
}

export const _errorMessages = {
    fnToCLIHasToHaveOneParameter: (path: string, functionName: string): string => tagUnindent`
        Function to convert to CLI with name:
        
            ${functionName}
            
        in path:
        
            ${path}
            
        has to have one parameter only, but has more than one.
    `,
};
