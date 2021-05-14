import { errorMessages } from "../errorMessages";
import { parsedOption, parsedCommandForCli } from "../types";
import { tagUnindent } from "../utils/index";
import { printCliSyntax } from "./printCliSyntax";
import { printOptions } from "./printOptions";

export type IPrintCliOptionsDocumentation = (_: {
    parsedCommand: parsedCommandForCli;
    cleanArgv: string[];
    optionNamesSet: Set<string>;
    optionNameToParsedOption: { [x: string]: parsedOption };
    commandName: string;
    flagNamesSet: Set<string>;
    flagNameToOptionNameHash: { [x: string]: string };
    packageName: string;
    commandHasRequiredOptions: boolean;
    isSingleOptionalCommandCli: boolean;
}) => string;

export const printCliOptionsDocumentation: IPrintCliOptionsDocumentation = function printCliOptionsDocumentation(_) {
    const {
        cleanArgv,
        commandName,
        flagNameToOptionNameHash,
        flagNamesSet,
        optionNameToParsedOption,
        optionNamesSet,
        parsedCommand,
        packageName,
        commandHasRequiredOptions,
        isSingleOptionalCommandCli,
    } = _;

    const options: parsedOption[] = (() => {
        if (cleanArgv.length > 1) {
            return cleanArgv.slice(0, -1).map((arg) => {
                if (arg.startsWith("--") && optionNamesSet.has(arg.slice(2)))
                    return optionNameToParsedOption[arg.slice(2)];
                if (arg.startsWith("--") && !optionNamesSet.has(arg.slice(2))) {
                    throw Error(errorMessages.helpGotBadOptionFlag(arg.slice(2), commandName, false));
                }
                if (arg.startsWith("-") && flagNamesSet.has(arg.slice(1))) {
                    return optionNameToParsedOption[flagNameToOptionNameHash[arg.slice(1)]];
                }
                if (arg.startsWith("-") && !flagNamesSet.has(arg.slice(1))) {
                    throw Error(errorMessages.helpGotBadOptionFlag(arg.slice(1), commandName, true));
                }
                throw Error(errorMessages.helpGotBadArgument(arg));
            });
        } else {
            // this clause is for when options is [] for the case of calling non strict single command line with --help/-h only
            return parsedCommand.options;
        }
    })();

    options.forEach(({ optionName: name }) => {
        if (!optionNamesSet.has(name)) {
            throw Error(errorMessages.helpGotBadOptionFlag(name, commandName, false));
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
