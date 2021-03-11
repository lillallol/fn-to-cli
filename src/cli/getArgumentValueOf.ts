import { optionTypeAsStringUnion, optionTypeUnion } from "../types";
import { internalLibraryErrorMessage } from "../utils";
import { JSONParseBoolean, JSONParseNumber } from "./JSONParse";

export function getArgumentValueOf(_: {
    /**
     * @description
     * Argv without the first three arguments.
     * It is without the first two for non strict and single command case.
     */
    argv: string[];
    /**
     * @description
     * The name of the flag or the option.
     */
    name: string;
    /**
     * @description
     * A predicate on whether the provided name is full name or flag.
     */
    isOption: boolean;
    type: optionTypeAsStringUnion;
    startingIndex: number;
    commandName: string;
}): { value: optionTypeUnion; endingIndex: number } {
    const { name, isOption, argv, startingIndex, type: expectedType,commandName } = _;

    if (expectedType === "string")
        return {
            value: argv[startingIndex],
            endingIndex: startingIndex,
        };
    if (expectedType === "number")
        return {
            value: JSONParseNumber(argv[startingIndex], isOption, name, commandName),
            endingIndex: startingIndex,
        };
    if (expectedType === "boolean")
        return {
            value: JSONParseBoolean(argv[startingIndex], isOption, name, commandName),
            endingIndex: startingIndex,
        };

    const arrayElementType = (() => {
        if (expectedType === "string[]") return "string";
        if (expectedType === "number[]") return "number";
        if (expectedType === "boolean[]") return "boolean";
        throw Error(internalLibraryErrorMessage);
    })();

    if (arrayElementType === "string") {
        const toReturn: string[] = [];
        let i = startingIndex;
        for (; i < argv.length && !argv[i].startsWith("-"); i++) {
            toReturn.push(argv[i]);
        }
        return {
            value: toReturn,
            endingIndex: i - 1,
        };
    }
    if (arrayElementType === "number") {
        const toReturn: number[] = [];
        let i = startingIndex;
        for (; i < argv.length && !argv[i].startsWith("-"); i++) {
            toReturn.push(JSONParseNumber(argv[i], isOption, name, commandName));
        }
        return {
            value: toReturn,
            endingIndex: i - 1,
        };
    }
    if (arrayElementType === "boolean") {
        const toReturn: boolean[] = [];
        let i = startingIndex;
        for (; i < argv.length && !argv[i].startsWith("-"); i++) {
            toReturn.push(JSONParseBoolean(argv[i], isOption, name, commandName));
        }
        return {
            value: toReturn,
            endingIndex: i - 1,
        };
    }
    throw Error(internalLibraryErrorMessage);
}
