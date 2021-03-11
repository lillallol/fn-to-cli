import * as fs from "fs";

/**
 * @description
 * Returns an array with all the file names (non deep) of the provided folder.
 */
 export function getAllFileNamesOfFolder(absolutePathToFolder: string): string[] {
    return fs
        .readdirSync(absolutePathToFolder, { withFileTypes: true })
        .filter((dirent) => !dirent.isDirectory())
        .map((dirent) => dirent.name);
}