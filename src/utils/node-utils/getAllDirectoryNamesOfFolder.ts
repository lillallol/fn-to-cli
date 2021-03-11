import * as fs from "fs";

/**
 * @description
 * Returns an array with all the directory names (non deep) of the provided folder.
 */
 export function getAllDirectoryNamesOfFolder(absolutePathToFolder: string): string[] {
    return fs
        .readdirSync(absolutePathToFolder, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}