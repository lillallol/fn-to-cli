import { getAbsolutePathToAllFilesOfFolderDeep } from "../../utils/index";
import { parsedCommandForFnToCli } from "../../types";
import { getCommandName } from "../getCommandName";
import { parseOptions } from "../parseOptions";
import { getCommandFromInputFileSoft } from "../getCommandFromInputFile/getCommandFromInputFile";
import { getCommandExportValue } from "../getCommandExportValue";
import { throwIfCommandNamesCollide } from "../throwIfCommandNamesCollide";
import { tagUnindent } from "../../utils/index";
import { getCommandDescription } from "../getDescription/getCommandDescription";

/**
 * @description
 * The properties that have `@private` JSDoc tag are ignored.
 * @todo
 * add description
 */
export function parseCommands(absolutePathToRootDir: string): parsedCommandForFnToCli[] {
    const parsedCommands: parsedCommandForFnToCli[] = getAbsolutePathToAllFilesOfFolderDeep(absolutePathToRootDir)
        .filter((path) => path.endsWith(".ts"))
        .flatMap((absolutePathToFile) =>
            getCommandFromInputFileSoft({ absolutePathToInputFile: absolutePathToFile }).map(({ fn, parameter }) => {
                const commandName = getCommandName(fn);
                const exportValue = getCommandExportValue(fn);
                const description = getCommandDescription({
                    absolutePathToInput: absolutePathToFile,
                    fn,
                    commandName
                });
                const options = parseOptions({
                    parameter,
                    absolutePathToInput: absolutePathToFile,
                    commandName,
                });
                return {
                    commandName,
                    exportValue,
                    description,
                    absolutePathToFile,
                    options,
                };
            })
        );
    if (parsedCommands.length === 0) throw Error(_errorMessages.noCLIFunctionsWhereFound(absolutePathToRootDir));
    const commandNames = parsedCommands.map(({ commandName: name }) => name);
    throwIfCommandNamesCollide(commandNames);
    return parsedCommands;
}

export const _errorMessages = {
    noCLIFunctionsWhereFound: (absolutePathToRootDir: string): string => tagUnindent`
        No functions with @CLI JSDoc tag where found in the root directory:

            ${absolutePathToRootDir}

    `,
};
