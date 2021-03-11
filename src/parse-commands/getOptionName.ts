import { isIdentifier, Node, TypeElement, unescapeLeadingUnderscores } from "typescript";
import { tagUnindent } from "../utils/index";

const memoizationTable: Map<Node, string> = new Map();

export function getOptionName(option: TypeElement): string {
    const memoizedValue = memoizationTable.get(option);
    if (typeof memoizedValue === "string") return memoizedValue;

    const { name: memberIdentifier } = option;
    if (memberIdentifier === undefined || !isIdentifier(memberIdentifier)) {
        throw Error(_errorMessages.memberHasNonIdentifierName);
    }
    const name = unescapeLeadingUnderscores(memberIdentifier.escapedText);
    if (name === "help") throw Error(_errorMessages.optionWithNameHelpIsReserved);

    memoizationTable.set(option, name);
    return name;
}

export const _errorMessages = {
    memberHasNonIdentifierName: "member has non identifier name",
    optionWithNameHelpIsReserved: tagUnindent`
        Option with name:

            help

        is reserved.
    `,
};
