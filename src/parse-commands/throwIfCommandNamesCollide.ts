import { getIndexOfFirstDuplicateValueOfArray } from "../utils/index";
import { errorMessages } from "../errorMessages";

export function throwIfCommandNamesCollide(commandNames: string[]): void {
    const duplicateIndex = getIndexOfFirstDuplicateValueOfArray(commandNames);
    if (duplicateIndex !== -1) {
        throw Error(errorMessages.commandNameCollides(commandNames[duplicateIndex]));
    }
}