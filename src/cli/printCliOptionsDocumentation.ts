import { parsedOption, parsedCommandForCli } from "../types";
import { tagUnindent } from "../utils/index";
import { printCliSyntax } from "./printCliSyntax";
import { printOptions } from "./printOptions";
import { printPackageNameAndVersion } from "./printPackageNameAndVersion";

export type IPrintCliOptionsDocumentation = (_: {
    parsedCommand: parsedCommandForCli;
    cleanArgv: string[];
    optionNamesHash: { [x: string]: boolean };
    optionNameToParsedOption: { [x: string]: parsedOption };
    commandName: string;
    flagNamesHash: { [x: string]: boolean };
    flagNameToOptionNameHash: { [x: string]: string };
    packageVersion: string;
    packageName: string;
    commandHasRequiredOptions: boolean;
    isSingleOptionalCommandCli: boolean;
}) => string;

export const printCliOptionsDocumentation: IPrintCliOptionsDocumentation = function printCliOptionsDocumentation(_) {
    const {
        cleanArgv,
        commandName,
        flagNameToOptionNameHash,
        flagNamesHash,
        optionNameToParsedOption,
        optionNamesHash,
        parsedCommand,
        packageName,
        packageVersion,
        commandHasRequiredOptions,
        isSingleOptionalCommandCli,
    } = _;

    const options: parsedOption[] = (() => {
        if (cleanArgv.length > 1) {
            return cleanArgv.slice(0, -1).map((arg) => {
                if (arg.startsWith("--") && optionNamesHash[arg.slice(2)])
                    return optionNameToParsedOption[arg.slice(2)];
                if (arg.startsWith("--") && optionNamesHash[arg.slice(2)] !== true) {
                    throw Error(_errorMessages.optionDoesNotExistInCommand(arg.slice(2), commandName, false));
                }
                if (arg.startsWith("-") && flagNamesHash[arg.slice(1)]) {
                    return optionNameToParsedOption[flagNameToOptionNameHash[arg.slice(1)]];
                }
                if (arg.startsWith("-") && flagNamesHash[arg.slice(1)] !== true) {
                    throw Error(_errorMessages.optionDoesNotExistInCommand(arg.slice(1), commandName, true));
                }
                throw Error(_errorMessages.invalidOptionFlag(arg));
            });
        } else {
            // this clause is for when options is [] for the case of calling non strict single command line with --help/-h only
            return parsedCommand.options;
        }
    })();

    options.forEach(({ optionName: name }) => {
        if (optionNamesHash[name] !== true) {
            throw Error(_errorMessages.optionDoesNotExistInCommand(name, commandName, false));
        }
    });

    const requiredOptions = options.filter(({ isOptional }) => !isOptional);
    const nonRequiredOptions = options.filter(({ isOptional }) => isOptional);

    const documentationParts: string[] = [];
    if (requiredOptions.length > 0) {
        documentationParts.push(
            printOptions({
                options: requiredOptions,
                required: true,
            })
        );
    }
    if (nonRequiredOptions.length > 0) {
        documentationParts.push(
            printOptions({
                options: nonRequiredOptions,
                required: false,
            })
        );
    }

    if (cleanArgv.length === 1) {
        documentationParts.unshift(tagUnindent`
            ${[
                printPackageNameAndVersion({
                    packageName,
                    packageVersion,
                }),
            ]}
            ${[
                printCliSyntax({
                    commandHasRequiredOptions,
                    commandName,
                    isSingleOptionalCommandCli,
                    packageName,
                }),
            ]}
            Description:

              ${[parsedCommand.description]}

        `);
    }
    return documentationParts.join("\n\n");
};

export const _errorMessages = {
    optionDoesNotExistInCommand: (optionName: string, commandName: string, isFlag: boolean): string => tagUnindent`
        -h or --help has been encountered so printing documentation

        ${isFlag ? "Flag" : "Option"} with name:

            ${optionName}

        does not exist in command with name:

            ${commandName}

    `,
    invalidOptionFlag: (optionName: string): string => tagUnindent`
        -h or --help has been encountered so printing documentation

        Invalid option/flag:

            ${optionName}

        It has to start with "--" for option or "-" for flag.
    `,
};
