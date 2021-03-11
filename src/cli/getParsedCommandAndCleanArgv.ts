import { parsedCommandForCli } from "../types";
import { internalLibraryErrorMessage, tagUnindent } from "../utils";

export function getParsedCommandAndCleanArgv(_: {
    argv: string[];
    strict: boolean;
    parsedCommands: parsedCommandForCli[];
}): { cleanArgv: string[]; parsedCommand: parsedCommandForCli } {
    const { argv, parsedCommands, strict } = _;

    const candidateCommandName: string | undefined = argv[2];
    const candidateParsedCommand = parsedCommands.find(({ command }) => command.name === candidateCommandName);
    const isSingleCommandCli = parsedCommands.length === 1;
    const isMultiCommandCli = !isSingleCommandCli;
    const commandNames = parsedCommands.map(({ command }) => command.name);

    if (candidateParsedCommand !== undefined) {
        return {
            cleanArgv: argv.slice(3),
            parsedCommand: candidateParsedCommand,
        };
    }
    if (candidateParsedCommand === undefined && isSingleCommandCli && !strict) {
        return {
            cleanArgv: argv.slice(2),
            parsedCommand: parsedCommands[0],
        };
    }
    // @TODO maybe print cli syntax here also?
    if (candidateCommandName === undefined || candidateCommandName[0] === "-") {
        throw Error(_errorMessages.youHaveNotProvidedACommand(commandNames));
    }
    if (candidateParsedCommand === undefined && isSingleCommandCli && strict) {
        throw Error(_errorMessages.youHaveToProvideCommandInStrictMode(parsedCommands[0].command.name));
    }
    if (candidateParsedCommand === undefined && (isMultiCommandCli || strict)) {
        throw Error(_errorMessages.providedCommandDoesNotExist(argv[2], commandNames));
    }
    throw Error(internalLibraryErrorMessage);
}

export const _errorMessages = {
    youHaveNotProvidedACommand : (commandNames : string[]): string => tagUnindent`
        You have not provided a command.

        Here are the available commands:

            ${[commandNames.join("\n")]}

    `,
    youHaveToProvideCommandInStrictMode: (commandName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        was not provided. You have to provide it in strict mode.
    `,
    providedCommandDoesNotExist: (commandName: string, commandNames: string[]): string => tagUnindent`
        Provided command:

            ${commandName}

        does not exist.

        Here are the available commands:

            ${[commandNames.join("\n")]}

    `,
};
