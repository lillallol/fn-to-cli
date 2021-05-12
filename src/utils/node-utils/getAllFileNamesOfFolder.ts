import * as fs from "fs";
import { tagUnindent } from "../es-utils/tagUnindent";

/**
 * @description
 * Returns an array with all the file names (non deep) of the provided folder.
 */
export function getAllFileNamesOfFolder(absolutePathToFolder: string): string[] {
    try {
        fs.accessSync(absolutePathToFolder);
    } catch {
        throw Error(tagUnindent`
            Absolute path to folder:

                ${absolutePathToFolder}

            can not be accessed.
        `);
    }
    return fs
        .readdirSync(absolutePathToFolder, { withFileTypes: true })
        .filter((dirent) => !dirent.isDirectory())
        .map((dirent) => dirent.name);
}
