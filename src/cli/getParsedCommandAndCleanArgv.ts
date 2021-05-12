import { errorMessages, internalErrorMessage } from "../errorMessages";
import { parsedCommandForCli } from "../types";

/**
 * @description
 * This function has also the responsibility for throwing error for invalid command name taking into account
 * strict and non-strict mode.
 */
export function getParsedCommandAndCleanArgv(_: {
    argv: string[];
    strict: boolean;
    parsedCommands: parsedCommandForCli[];
}): { cleanArgv: string[]; parsedCommand: parsedCommandForCli } {
    const { argv, parsedCommands, strict } = _;

    const candidateCommandName: string | undefined = argv[2];
    const candidateParsedCommand = parsedCommands.find(({ commandName }) => commandName === candidateCommandName);
    const isSingleCommandCli = parsedCommands.length === 1;
    const isMultiCommandCli = !isSingleCommandCli;
    const commandNames = parsedCommands.map(({ commandName }) => commandName);

    // candidate parsed command name is legit and we are fine for both strict non strict mode
    if (candidateParsedCommand !== undefined) {
        return {
            cleanArgv: argv.slice(3),
            parsedCommand: candidateParsedCommand,
        };
    }

    // the rest of the code deals with candidateParsedCommand === undefined

    // candidate parsed command is not a command, but this is fine since we are in non strict mode for single command cli
    if (candidateParsedCommand === undefined && isSingleCommandCli && !strict) {
        return {
            cleanArgv: argv.slice(2),
            parsedCommand: parsedCommands[0],
        };
    }

    if (candidateCommandName === undefined || candidateCommandName[0] === "-") {
        throw Error(errorMessages.youHaveNotProvidedACommand(commandNames));
    }
    if (candidateParsedCommand === undefined && (isMultiCommandCli || strict)) {
        throw Error(errorMessages.providedCommandDoesNotExist(argv[2], commandNames));
    }
    throw Error(internalErrorMessage.internalLibraryErrorMessage);
}
