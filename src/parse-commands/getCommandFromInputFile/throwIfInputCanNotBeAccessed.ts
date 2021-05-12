import { pathCanBeAccessed } from "../../utils/index";
import { errorMessages } from "../../errorMessages";

export function throwIfInputCanNotBeAccessed(absolutePathToInput: string): void {
    if (!pathCanBeAccessed(absolutePathToInput)) {
        throw Error(errorMessages.inputCanNotBeAccessed(absolutePathToInput));
    }
}

