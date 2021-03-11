import { pathCanBeAccessed } from "../../utils/index";
import { tagUnindent } from "../../utils/index";

export function throwIfInputCanNotBeAccessed(absolutePathToInput: string): void {
    if (!pathCanBeAccessed(absolutePathToInput)) {
        throw Error(_errorMessages.inputCanBeAccessed(absolutePathToInput));
    }
}
export const _errorMessages = {
    inputCanBeAccessed: (input: string): string => tagUnindent`
        Provided path to input:

            ${input}

        does not exists.
    `,
};
