import { FunctionDeclaration } from "typescript";
import { hasDefaultModifier } from "../utils/index";
import { hasExportModifier } from "../utils/index";
import { errorMessages } from "../errorMessages";
import { getCommandName } from "./getCommandName";

/**
 * @description
 * It also validates that the provided command (function declaration) has export or default
 * modifier (i.e. it is named or default exported).
 */
export function getCommandExportValue(fn: FunctionDeclaration): "default" | "named" {
    if (hasExportModifier(fn) && !hasDefaultModifier(fn)) return "named";
    if (hasDefaultModifier(fn)) return "default";
    throw Error(errorMessages.commandHasToBeExported(getCommandName({ fn }).commandName));
}
