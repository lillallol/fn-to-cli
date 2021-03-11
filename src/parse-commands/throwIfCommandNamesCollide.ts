import { getIndexOfFirstDuplicateValueOfArray } from "../utils/index";
import { tagUnindent } from "../utils/index";

export function throwIfCommandNamesCollide(commandNames: string[]): void {
    const duplicateIndex = getIndexOfFirstDuplicateValueOfArray(commandNames);
    if (duplicateIndex !== -1) {
        throw Error(_errorMessages.pathCollides(commandNames[duplicateIndex]));
    }
}

export const _errorMessages = {
    pathCollides: (path: string): string => tagUnindent`
        The input path:

            ${path}

        has been provided more than one time.
    `,
};