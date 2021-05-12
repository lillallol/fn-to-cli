import { getAbsolutePathToAllFilesOfFolderDeep } from "../../utils/index";
import { parsedCommandForFnToCli } from "../../types";
import { getCommandName } from "../getCommandName";
import { parseOptions } from "../parseOptions";
import { getCommandFromInputFileSoft } from "../getCommandFromInputFile/getCommandFromInputFile";
import { getCommandExportValue } from "../getCommandExportValue";
import { throwIfCommandNamesCollide } from "../throwIfCommandNamesCollide";
import { getCommandDescription } from "../getDescription/getCommandDescription";
import { errorMessages } from "../../errorMessages";

/**
 * @description
 * Given the path to the declaration directory, it searches all the `.d.ts` files for function declaration statements
 * with `@CLI` JSDoc tag and parses their command to a data structure appropriate for cli.
 */
export function parseCommands(absolutePathToRootDir: string): parsedCommandForFnToCli[] {
    const parsedCommands: parsedCommandForFnToCli[] = getAbsolutePathToAllFilesOfFolderDeep(absolutePathToRootDir)
        .filter((path) => path.endsWith(".ts"))
        .flatMap((absolutePathToFile) =>
            getCommandFromInputFileSoft({ absolutePathToInputFile: absolutePathToFile }).map<parsedCommandForFnToCli>(
                ({ fn, parameter }) => {
                    const { functionName, commandName } = getCommandName({ fn });
                    const exportValue = getCommandExportValue(fn);
                    const description = getCommandDescription({
                        fn,
                        commandName,
                    });
                    const options = parseOptions({
                        parameter,
                        absolutePathToInput: absolutePathToFile,
                        commandName,
                    });
                    return {
                        functionName,
                        commandName,
                        exportValue,
                        description,
                        absolutePathToFile,
                        options,
                    };
                }
            )
        );
    if (parsedCommands.length === 0) throw Error(errorMessages.noCLIFunctionsWhereFound(absolutePathToRootDir));
    const commandNames = parsedCommands.map(({ commandName: name }) => name);
    throwIfCommandNamesCollide(commandNames);
    return parsedCommands;
}
