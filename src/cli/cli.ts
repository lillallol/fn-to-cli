import { internalErrorMessage, errorMessages } from "../errorMessages";
import { parsedCommandForCli } from "../types";
import { lastElement } from "../utils/index";
import { optionNamesCountMap } from "./CountMap";
import { createFlagNamesSet } from "./createFlagNamesHash";
import { createFlagNameToOptionNameHash } from "./createFlagNameToOptionNameHash";
import { createOptionNamesSet } from "./createOptionNamesSet";
import { createOptionNameToFlagNameHash } from "./createOptionNameToFlagNameHash";
import { createOptionNameToParsedOptionHash } from "./createOptionNameToParsedOptionHash";
import { getParsedCommandAndCleanArgv } from "./getParsedCommandAndCleanArgv";
import { IPrintCliCommandsDocumentation } from "./printCliCommandsDocumentation";
import { IPrintCliOptionsDocumentation } from "./printCliOptionsDocumentation";

/**
 * @description
 * Give the necessary information to create a CLI.
 */
export type ICli = (_: {
    parsedCommands: parsedCommandForCli[];
    /**
     * @description
     * `process.argv`
     */
    argv: string[];
    cliVersion: string;
    cliName: string;
    /**
     * @description
     * For single command CLI it is not required by default to provided the command name when using the CLI,
     * unless this value is given `true` value.
     * @default false
     */
    strict?: boolean;
}) => void;

export function cliFactory(
    printCliCommandsDocumentation: IPrintCliCommandsDocumentation,
    printCliOptionsDocumentation: IPrintCliOptionsDocumentation
): ICli {
    return function cli(_) {
        const { argv, parsedCommands, cliName: packageName, cliVersion: packageVersion } = _;
        let { strict } = _;
        if (strict === undefined) strict = false;

        const isSingleCommandCli = parsedCommands.length === 1;
        const isStrict = strict;
        const isSingleOptionalCommandCli = isSingleCommandCli && !isStrict;
        const isMultiCommandCli = !isSingleCommandCli;
        const commandNames: string[] = parsedCommands.map(({ command }) => command.name);

        //@TODO think of a way that does not need to reserve h|help and v|version
        const shouldLogVersion: boolean =
            (lastElement(argv) === "-v" || lastElement(argv) === "--version") &&
            argv.length === 3 &&
            (isStrict || isMultiCommandCli);
        const shouldLogCommandsDocumentationInTerminal: boolean =
            (lastElement(argv) === "-h" || lastElement(argv) === "--help") &&
            argv.length === 3 &&
            (isStrict || isMultiCommandCli);
        const shouldLogOptionsDocumentation: boolean = lastElement(argv) === "-h" || lastElement(argv) === "--help";

        if (shouldLogVersion) {
            console.log(packageVersion);
            return;
        }
        if (shouldLogCommandsDocumentationInTerminal) {
            // this is never printed for non strict single command CLI
            console.log(
                printCliCommandsDocumentation({
                    commandNames,
                    packageName,
                    packageVersion,
                })
            );
            return;
        }

        const { cleanArgv, parsedCommand } = getParsedCommandAndCleanArgv({
            argv,
            strict,
            parsedCommands,
        });
        const { command, options, commandName } = parsedCommand;
        const commandHasRequiredOptions = options.some(({ isOptional }) => !isOptional);

        const flagNamesSet = createFlagNamesSet(options);
        const optionNamesSet = createOptionNamesSet(options);
        const flagNameToOptionNameHash = createFlagNameToOptionNameHash(options);
        const optionNameToFlagNameHash = createOptionNameToFlagNameHash(options);
        const optionNameToParsedOption = createOptionNameToParsedOptionHash(options);

        if (shouldLogOptionsDocumentation) {
            console.log(
                printCliOptionsDocumentation({
                    parsedCommand,
                    cleanArgv,
                    optionNamesSet,
                    optionNameToParsedOption,
                    commandName,
                    flagNamesSet,
                    flagNameToOptionNameHash,
                    packageVersion,
                    packageName,
                    commandHasRequiredOptions,
                    isSingleOptionalCommandCli,
                })
            );
            return;
        }

        /**
         * @description
         * This is the parameter that is passed to the command.
         */
        const commandParameter: { [optionName: string]: unknown } = {};

        const optionNamesCount: optionNamesCountMap = new optionNamesCountMap({
            options,
            optionNameToFlagNameHash,
            commandName,
        });

        for (let i = 0; i < cleanArgv.length; i = i + 2) {
            const currentArgumentName = cleanArgv[i];

            if (!currentArgumentName.startsWith("-")) {
                throw Error(errorMessages.invalidArgumentName(currentArgumentName));
            }
            if (currentArgumentName.startsWith("--")) {
                const optionName = cleanArgv[i].slice(2);
                optionNamesCount.increment(optionName);
                const value: unknown = eval(cleanArgv[i + 1]);
                commandParameter[optionName] = value;
                continue;
            }
            if (currentArgumentName.startsWith("-")) {
                const flagName = cleanArgv[i].slice(1);
                const optionName = flagNameToOptionNameHash[flagName];
                if (!flagNamesSet.has(flagName)) {
                    throw Error(errorMessages.flagDoesNotExistForGivenCommand(flagName, commandName));
                }
                optionNamesCount.increment(optionName);
                const value: unknown = eval(cleanArgv[i + 1]);
                commandParameter[optionName] = value;
                continue;
            }
            throw Error(internalErrorMessage.internalLibraryErrorMessage);
        }

        optionNamesCount.throwIfNotAllNonOptionalParameterGotValues();

        command(commandParameter);
    };
}
