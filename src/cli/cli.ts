import { optionTypeUnion, parsedCommandForCli } from "../types";
import { internalLibraryErrorMessage, lastElement, tagUnindent } from "../utils/index";
import { createFlagNamesHash } from "./createFlagNamesHash";
import { createFlagNameToOptionNameHash } from "./createFlagNameToOptionNameHash";
import { createOptionNamesHash } from "./createOptionNamesHash";
import { createOptionNameToFlagNameHash } from "./createOptionNameToFlagNameHash";
import { createOptionNameToParsedOptionHash } from "./createOptionNameToParsedOptionHash";
import { createRequiredOptionNameHash } from "./createRequiredOptionNameHash";
import { getArgumentValueOf } from "./getArgumentValueOf";
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

        // prettier-ignore
        if (
            (lastElement(argv) === "-h" || lastElement(argv) === "--help") && argv.length === 3 && (isStrict || isMultiCommandCli)
        ) {
            // this is never printed for non strict single command CLI
            console.log(printCliCommandsDocumentation({
                commandNames,
                packageName,
                packageVersion
            }));
            return;
        }

        const { cleanArgv, parsedCommand } = getParsedCommandAndCleanArgv({
            argv,
            strict,
            parsedCommands,
        });
        const { command, options } = parsedCommand;
        const commandName = command.name;
        const commandHasRequiredOptions = options.some(({ isOptional }) => !isOptional);

        const flagNamesHash = createFlagNamesHash(options);
        const optionNamesHash = createOptionNamesHash(options);
        const flagNameToOptionNameHash = createFlagNameToOptionNameHash(options);
        const optionNameToFlagNameHash = createOptionNameToFlagNameHash(options);
        const optionNameToParsedOption = createOptionNameToParsedOptionHash(options);
        const requiredOptionNameHasNotBeGivenValueHash = createRequiredOptionNameHash(options);

        if (lastElement(argv) === "-h" || lastElement(argv) === "--help") {
            console.log(
                printCliOptionsDocumentation({
                    parsedCommand,
                    cleanArgv,
                    optionNamesHash,
                    optionNameToParsedOption,
                    commandName,
                    flagNamesHash,
                    flagNameToOptionNameHash,
                    packageVersion,
                    packageName,
                    commandHasRequiredOptions,
                    isSingleOptionalCommandCli,
                })
            );
            return;
        }

        const commandParameter: { [optionName: string]: optionTypeUnion } = {};

        const optionNameCount: { [optionName: string]: number } = {};
        const flagNameCount: { [flagName: string]: number } = {};

        for (let i = 0; i < cleanArgv.length; i++) {
            const currentArgumentName = cleanArgv[i];

            if (!currentArgumentName.startsWith("--") && !currentArgumentName.startsWith("-")) {
                throw Error(_errorMessages.invalidArgumentName(currentArgumentName));
            }
            if (currentArgumentName.startsWith("--")) {
                const optionName = cleanArgv[i].slice(2);
                {
                    if (optionNamesHash[optionName] !== true) {
                        throw Error(_errorMessages.invalidOptionName(optionName, commandName));
                    }
                    if (optionNameCount[optionName] === undefined) optionNameCount[optionName] = 1;
                    else if (optionNameCount[optionName] === 1) {
                        throw Error(_errorMessages.optionGivenValueMoreThanOnce(optionName));
                    }
                    const flagName = optionNameToFlagNameHash[optionName];
                    if (flagName !== undefined && flagNameCount[flagName] === undefined) flagNameCount[flagName] = 1;
                    if (flagName !== undefined && flagNameCount[flagName] > 1) {
                        throw Error(_errorMessages.optionFlagGivenValueMoreThanOnce(optionName, flagName));
                    }
                    if (requiredOptionNameHasNotBeGivenValueHash[optionName]) {
                        requiredOptionNameHasNotBeGivenValueHash[optionName] = false;
                    }
                }
                const { endingIndex, value } = getArgumentValueOf({
                    isOption: true,
                    name: optionName,
                    type: optionNameToParsedOption[optionName].type,
                    argv: cleanArgv,
                    startingIndex: i + 1,
                    commandName,
                });
                i = endingIndex;
                commandParameter[optionName] = value;
                continue;
            }
            if (currentArgumentName.startsWith("-")) {
                const flagName = cleanArgv[i].slice(1);
                {
                    if (flagNamesHash[flagName] !== true) {
                        throw Error(_errorMessages.invalidArgumentFlag(flagName, commandName));
                    }
                    if (flagNameCount[flagName] === undefined) flagNameCount[flagName] = 1;
                    if (flagNameCount[flagName] !== undefined && flagNameCount[flagName] > 1) {
                        throw Error(_errorMessages.flagGivenValueMoreThanOnce(flagName));
                    }
                    const optionName = flagNameToOptionNameHash[flagName];
                    if (optionNameCount[optionName] === undefined) optionNameCount[optionName] = 1;
                    else if (optionNameCount[optionName] > 1) {
                        throw Error(_errorMessages.optionFlagGivenValueMoreThanOnce(optionName, flagName));
                    }
                    if (requiredOptionNameHasNotBeGivenValueHash[optionName]) {
                        requiredOptionNameHasNotBeGivenValueHash[optionName] = false;
                    }
                }
                const { value, endingIndex } = getArgumentValueOf({
                    isOption: true,
                    name: flagName,
                    type: optionNameToParsedOption[flagNameToOptionNameHash[flagName]].type,
                    argv: cleanArgv,
                    startingIndex: i + 1,
                    commandName,
                });
                commandParameter[flagNameToOptionNameHash[flagName]] = value;
                i = endingIndex;
                continue;
            }
            throw Error(internalLibraryErrorMessage);
        }
        const requiredParametersMissingValues = Object.entries(requiredOptionNameHasNotBeGivenValueHash)
            .filter(([, v]) => v)
            .map(([k]) => k);
        if (requiredParametersMissingValues.length > 0) {
            throw Error(_errorMessages.requiredParametersMissingValues(requiredParametersMissingValues));
        }

        command(commandParameter);
    };
}

export const _errorMessages = {
    invalidOptionName: (optionName: string, commandName: string): string => tagUnindent`
        Provided option:

            ${optionName}

        does not exist for command:

            ${commandName}
        
    `,
    invalidArgumentName: (argumentName: string): string => tagUnindent`
        Provided argument:

            ${argumentName}

        is invalid. It has two start with "-" or "--".
    `,
    invalidArgumentFlag: (flagName: string, commandName: string): string => tagUnindent`
        Provided flag:

            ${flagName}

        does not exist for command:

            ${commandName}

    `,
    duplicateProvidedOption: (optionName: string): string => tagUnindent`
        Provided option:

            ${optionName}

        has been given value more than one time.
    `,
    duplicateProvidedFlag: (flagName: string): string => tagUnindent`
        Provided flag:

            ${flagName}

        has been given value more than one time.
    `,
    optionGivenValueMoreThanOnce: (optionName: string): string => tagUnindent`
        Option with name:

            ${optionName}

        has been provided value more than once.
    `,
    flagGivenValueMoreThanOnce: (flagName: string): string => tagUnindent`
        Flag with name: 

            ${flagName}

        has been provided value more than once.
    `,
    optionFlagGivenValueMoreThanOnce: (optionName: string, flagName: string): string => tagUnindent`
        Option with name:
        
            ${optionName}

        and flag name:

            ${flagName}

        was given a value as option and as a flag.
    `,
    requiredParametersMissingValues: (requiredParametersMissingValues: string[]): string => tagUnindent`
        The options with names:

            ${[requiredParametersMissingValues.join("\n")]}

        are required to be given a value but they were not given.
    `,
};
