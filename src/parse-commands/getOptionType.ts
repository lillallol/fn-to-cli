import * as path from "path";
import { PropertySignature } from "typescript";
import { printNodeObject } from "../utils/index";
import { errorMessages } from "../errorMessages";
import { getOptionName } from "./getOptionName";

/**
 * @description
 * It validates if the typescript ast node for the type exists.
 * It returns the type.
 */
export function getOptionType(member: PropertySignature, absolutePathToInput: string, commandName: string): string {
    const optionName = getOptionName({ option: member, commandName });
    const { type } = member;
    if (type === undefined) {
        throw Error(errorMessages.optionMemberHasNoType(optionName, commandName));
    }
    const toReturn = printNodeObject(type, path.resolve(__dirname, absolutePathToInput)).trim();
    return toReturn;
}
