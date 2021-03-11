import * as path from "path";
import { PropertySignature } from "typescript";
import { arrayFromOptionTypesAsStrings, optionTypeAsStringUnion } from "../types";
import { printNodeObject } from "../utils/index";
import { tagUnindent } from "../utils/index";
import { getOptionName } from "./getOptionName";

/**
 * @description
 * It validates if the typescript ast node for the type exists.
 * It validates if the type is `boolean` or `string`
 * It returns the type.
 */
export function getOptionType(member: PropertySignature, absolutePathToInput: string, commandName: string): optionTypeAsStringUnion {
    const optionName = getOptionName(member);
    const { type } = member;
    if (type === undefined) {
        throw Error(_errorMessages.optionMemberHasNoType(optionName, commandName, absolutePathToInput));
    }
    const toReturn = printNodeObject(type, path.resolve(__dirname, absolutePathToInput)).trim();

    if (toReturn === "string") return "string";
    if (toReturn === "number") return "number";
    if (toReturn === "boolean") return "boolean";
    if (toReturn === "string[]") return "string[]";
    if (toReturn === "number[]") return "number[]";
    if (toReturn === "boolean[]") return "boolean[]";

    throw Error(_errorMessages.optionMemberHasWrongType(optionName, commandName, absolutePathToInput, toReturn));
}

export const _errorMessages = {
    optionMemberHasNoType: (
        optionName: string,
        commandName: string,
        absolutePathToInput: string
    ): string => tagUnindent`
        Command with name:

            ${commandName}

        in path:

            ${absolutePathToInput}

        has option with name:

            ${optionName}

        that has no type.
    `,
    optionMemberHasWrongType: (
        optionName: string,
        commandName: string,
        absolutePathToInput: string,
        type: string
    ): string => tagUnindent`
        Command with name:

            ${commandName}

        in path:

            ${absolutePathToInput}

        has option with name:

            ${optionName}

        which has type:
        
            ${type}
        
        while it has to have one of the following types:
        
            ${[arrayFromOptionTypesAsStrings.join("\n")]}
        
    `,
};
