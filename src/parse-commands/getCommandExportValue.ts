import { FunctionDeclaration } from "typescript";
import { hasDefaultModifier } from "../utils/index";
import { hasExportModifier } from "../utils/index";
import { tagUnindent } from "../utils/index";
import { getCommandName as getCommandName } from "./getCommandName";

/**
 * @description
 * It also validates that the provided command (function declaration) has export or default
 * modifier (i.e. it is named or default exported).
*/
export function getCommandExportValue(fn: FunctionDeclaration): "default" | "named" {
    if (hasExportModifier(fn) && !hasDefaultModifier(fn)) return "named";
    if (hasDefaultModifier(fn)) return "default";
    throw Error(_errorMessages.commandHasToBeExported(getCommandName(fn)));
}

export const _errorMessages = {
    commandHasToBeExported: (commandName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        is not exported while it has to be.
    `,
};
