import { internalErrorMessage } from "../../errorMessages";

/**
 * @description
 * It returns the index of the first duplicate value it encounters in the array.
 * It returns `-1` when the array has no duplicates.
 */
export function getIndexOfFirstDuplicateValueOfArray(array: unknown[]): number {
    const map: Map<unknown, number> = new Map();
    for (let i = 0; i < array.length; i++) {
        const v = map.get(array[i]);
        if (v === undefined) {
            map.set(array[i], i);
            continue;
        }
        if (typeof v === "number") {
            return v;
        }
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    }
    return -1;
}
