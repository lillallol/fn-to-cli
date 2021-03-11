import * as path from "path";
import { getAllDirectoryNamesOfFolder } from "./getAllDirectoryNamesOfFolder";

/**
 * @description
 * Returns all the absolute path (non deep) to the directories of the specified folder.
 */
 export function getAbsolutePathToAllDirectoriesOfFolder(absolutePathToFolder: string): string[] {
    return getAllDirectoryNamesOfFolder(absolutePathToFolder).map((name) => path.resolve(absolutePathToFolder, name));
}
