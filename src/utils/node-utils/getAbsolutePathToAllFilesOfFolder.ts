import { getAllFileNamesOfFolder } from "./getAllFileNamesOfFolder";
import * as path from "path";

/**
 * @description
 * Returns all the absolute path (non deep) to the files of the specified folder.
 */
 export function getAbsolutePathToAllFilesOfFolder(absolutePathToFolder: string): string[] {
    return getAllFileNamesOfFolder(absolutePathToFolder).map((name) => path.resolve(absolutePathToFolder, name));
}