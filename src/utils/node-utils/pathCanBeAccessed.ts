import * as fs from "fs";

/**
 * @description
 * Returns a predicate on whether the provided absolute path can be accessed.
 */
export function pathCanBeAccessed(absolutePath: string): boolean {
    try {
        fs.accessSync(absolutePath);
    } catch (e) {
        return false;
    }
    return true;
}
