import { isIdentifier, Node, TypeElement, unescapeLeadingUnderscores } from "typescript";
import { errorMessages } from "../errorMessages";
import { constants } from "../constants";

const memoizationTable: Map<Node, string> = new Map();

export function getOptionName(_: { option: TypeElement; commandName: string }): string {
    const { commandName, option } = _;
    const memoizedValue = memoizationTable.get(option);
    const { reservedOptionNames } = constants;

    if (typeof memoizedValue === "string") return memoizedValue;

    const { name: memberIdentifier } = option;
    if (memberIdentifier === undefined || !isIdentifier(memberIdentifier)) {
        throw Error(errorMessages.memberHasNonIdentifierName);
    }
    const name = unescapeLeadingUnderscores(memberIdentifier.escapedText);

    if (reservedOptionNames.includes(name)) {
        throw Error(errorMessages.optionCanNotHaveReservedName(commandName, name));
    }

    memoizationTable.set(option, name);
    return name;
}
