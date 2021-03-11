import { tagUnindent } from "../utils/index";

export function JSONParse(
    v: string,
    /**
     * @description
     * Predicate for whether it is flag or option?
     */
    isOption: boolean,
    name: string,
    commandName: string
): unknown {
    let toReturn: unknown;
    try {
        toReturn = JSON.parse(v);
    } catch {
        throw Error(_errorMessages.nonJSONSerializableValue(v, isOption, name, commandName));
    }
    return toReturn;
}

export function JSONParseNumber(
    v: string,
    /**
     * @description
     * Predicate for whether it is flag or option?
     */
    isOption: boolean,
    name: string,
    commandName: string
): number {
    const toReturn = JSONParse(v, isOption, name, commandName);
    if (typeof toReturn === "number") {
        return toReturn;
    } else {
        throw Error(_errorMessages.providedValueIsOfWrongType(v, isOption, name, "number", commandName));
    }
}

export function JSONParseBoolean(
    v: string,
    /**
     * @description
     * Predicate for whether it is flag or option?
     */
    isOption: boolean,
    name: string,
    commandName: string
): boolean {
    const toReturn = JSONParse(v, isOption, name, commandName);
    if (typeof toReturn === "boolean") {
        return toReturn;
    } else {
        throw Error(_errorMessages.providedValueIsOfWrongType(v, isOption, name, "boolean", commandName));
    }
}

export const _errorMessages = {
    nonJSONSerializableValue: (
        value: string,
        isOption: boolean,
        flagOrOptionName: string,
        commandName: string
    ): string => tagUnindent`

        Provided value:

            ${value}

        for ${isOption ? "option" : "flag"}:

            ${flagOrOptionName}

        of command:

            ${commandName}

        is not JSON serializable.
    `,
    providedValueIsOfWrongType: (
        value: string,
        isOption: boolean,
        flagOrOptionName: string,
        type: string,
        commandName: string
    ): string => tagUnindent`
        Provided value:

            ${value}

        for ${isOption ? "option" : "flag"}:

            ${flagOrOptionName}

        of command:

            ${commandName}
        
        is not of type:
            
            ${type}
            
        as it has to be.
    `,
};
