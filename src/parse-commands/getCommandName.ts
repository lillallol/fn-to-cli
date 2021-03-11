import { FunctionDeclaration, unescapeLeadingUnderscores } from "typescript";
import { internalLibraryErrorMessage } from "../utils";

export function getCommandName(fn: FunctionDeclaration): string {
    const { name } = fn;
    if (name === undefined) throw Error(internalLibraryErrorMessage);
    return unescapeLeadingUnderscores(name.escapedText);
}
