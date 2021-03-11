import { getAbsolutePathToAllDirectoriesOfFolder } from "./getAbsolutePathToAllDirectoriesOfFolder";
import { getAbsolutePathToAllFilesOfFolder } from "./getAbsolutePathToAllFilesOfFolder";
import * as path from "path";

/**
 * @description
 * Returns all the absolute path (deep) to the files of the specified folder.
 */
 export function getAbsolutePathToAllFilesOfFolderDeep(absolutePathToFolder: string): string[] {
    const toReturn: string[] = [];
    (function recurse(cwdAbsolutePath: string): void {
        toReturn.push(
            ...getAbsolutePathToAllFilesOfFolder(cwdAbsolutePath).map((name) =>
                path.resolve(absolutePathToFolder, name)
            )
        );
        getAbsolutePathToAllDirectoriesOfFolder(cwdAbsolutePath).forEach((path) => recurse(path));
    })(absolutePathToFolder);
    return toReturn;
}