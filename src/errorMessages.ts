import { constants } from "./constants";
import { tagUnindent } from "./utils";

export const errorMessages = {
    commandHasToBeExported: (commandName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        is not exported while it has to be.
    `,
    optionalPropertyHasNoDefaultJSDocTag: (identifierName: string, commandName: string): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        its option with name:

            ${identifierName}

        has no default JSDoc tag, while it is optional.
    `,
    nonOptionalPropertyHasDefaultJSDocTag: (identifierName: string, commandName: string): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        its option with name:
    
            ${identifierName}
    
        has default JSDoc tag, while it is not optional property.
    `,
    propertyHasMoreThanOneDefaultJSDocTagsInMember: (
        identifierName: string,
        commandName: string
    ): string => tagUnindent`
        For the command with name:
        
            ${commandName}

        its option with name:
        
            ${identifierName}

        has more than one @default JSDoc tags, while it has to have only one.
    `,
    moreThanOneJSDocFlagTag: (_: { optionName: string; commandName: string }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        has option with name:

            ${_.optionName}

        that has more than one flag JSDoc tags, while it has to have only one.
    `,
    flagJSDocTagHasNoValue: (_: { optionName: string; commandName: string }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        has option with name:

            ${_.optionName}

        that has flag JSDoc tag without value, while it has to have.
    `,
    flagHasToBeOneLetter: (_: { optionName: string; commandName: string }): string => {
        const { flagJsDocValueValidPattern } = constants;
        const { commandName, optionName } = _;
        return tagUnindent`
            Command with name:

                ${commandName}

            has option with name:

                ${optionName}

            that has flag JSDoc tag with value that is not of the following pattern:

                ${flagJsDocValueValidPattern.source}

        `;
    },
    astNodeHasNoJSDocComment: (_: { commandName: string; optionName: string }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        has option of name:

            ${_.optionName}

        that does not have JSDoc comment.
    `,
    astNodeHasMoreThanOneJSDocComment: (_: {
        commandName: string;
        optionName: string | undefined;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        ${
            _.optionName === undefined
                ? ""
                : [
                      tagUnindent`
                        has option of name:

                            ${_.optionName}

                        that
                      `,
                  ]
        } has more than one JSDoc comment.
    `,
    memberHasNonIdentifierName: "member has non identifier name",
    optionMemberHasNoType: (optionName: string, commandName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that has no type.
    `,
    moreThanOnePrivateJSDocTag: (commandName: string, optionName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that has more that one private JSDoc tags.
    `,
    nonOptionalOptionCanNotBePrivate: (commandName: string, optionName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that is not optional and has private JSDoc tag. You have to either mke it optional or remove the private JSDoc tag.
    `,
    privateJSDocTagHasValue: (
        commandName: string,
        optionName: string,
        privateJSDocTagValue: string
    ): string => tagUnindent`
        Command with name:

            ${commandName}

        has option with name:

            ${optionName}

        that has private JSDoc tag, with value:

            ${privateJSDocTagValue}

        while it has to have no value.
    `,
    memberIsNotPropertySignature: (_: { commandName: string; optionName: string }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        has option with name:

            ${_.optionName}

        that is not property signature.
    `,
    commandNameCollides: (commandName: string): string => tagUnindent`
        Command with name:

            ${commandName}

        is used from more than one commands.
    `,
    commandHasNoName: (absolutePathToInputFile: string): string => tagUnindent`
        In path:
        
            ${absolutePathToInputFile}
        
        there is a function with @CLI JSDoc that has no name.
        
        Add a name to the function.
    `,
    fnToCLIHasToHaveOneParameter: (functionName: string): string => tagUnindent`
        Function to convert to CLI with name:

            ${functionName}

        has to have one parameter only, but has more than one.
    `,
    inputCanNotBeAccessed: (input: string): string => tagUnindent`
        Provided path to input d.ts file:

            ${input}

        can not be accessed.
    `,
    invalidTypeParameterForFunctionConvertToCLI: (fnName: string): string => {
        return tagUnindent`
            Function to convert to CLI with name:
            
                ${fnName}
            
            has to have its single parameter with object literal type.
        `;
    },
    astNodeHasNoJSDocDescriptionValue: (_: {
        commandName: string;
        optionName: string | undefined;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
                    has option with name:

                        ${_.optionName}

                    that
                  `,
        ]} has no description value in its JSDoc comment.
    `,
    astNodeHasMoreThanOneJSDocDescriptionTags: (_: {
        commandName: string;
        optionName: string | undefined;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
                    has option with name:

                        ${_.optionName}

                    that
                  `,
        ]} has more than one JSDoc @description tags.
    `,
    astNodeHasBothATagLessAndTagFullDescription: (_: {
        commandName: string;
        optionName: string | undefined;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        ${[
            _.optionName === undefined
                ? ""
                : tagUnindent`
                    has option with name:

                        ${_.optionName}

                    that
                  `,
        ]} has both tag less and tag full JSDoc description.
    `,
    noCLIFunctionsWhereFound: (absolutePathToRootDir: string): string => tagUnindent`
        No functions with @CLI JSDoc tag where found in the root directory:
            
            ${absolutePathToRootDir}
            
    `,
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
    flagDoesNotExistForGivenCommand: (flagName: string, commandName: string): string => tagUnindent`
        Provided flag:

            ${flagName}

        does not exist for command:

            ${commandName}

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
    youHaveNotProvidedACommand: (commandNames: string[]): string => tagUnindent`
        You have not provided a command.

        Here are the available commands:

            ${[commandNames.join("\n")]}

    `,
    providedCommandDoesNotExist: (commandName: string, commandNames: string[]): string => tagUnindent`
        Provided command:

            ${commandName}

        does not exist.

        Here are the available commands:

            ${[commandNames.join("\n")]}

    `,
    helpGotBadOptionFlag: (optionName: string, commandName: string, isFlag: boolean): string => tagUnindent`
        -h or --help has been encountered so printing documentation

        ${isFlag ? "Flag" : "Option"} with name:

            ${optionName}

        does not exist in command with name:

            ${commandName}

    `,
    helpGotBadArgument: (badArgument: string): string => tagUnindent`
        -h or --help has been encountered so printing documentation

        Invalid option/flag:

            ${badArgument}

        It has to start with "--" for option or "-" for flag.
    `,
    pathToBinAlreadyExists: (absolutePathToOutput: string): string => tagUnindent`
        Path to output:

            ${absolutePathToOutput}

        is already a file.

        Change the output path or delete the file.
    `,
    pathToBinFileHasToEndWithJs: (absolutePathToOutput: string): string => tagUnindent`
        Path to output bin file:

            ${absolutePathToOutput}

        has to end with ".js".
    `,
    badDeclarations: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        has "declarations" property that is not true.
    `,
    badModuleProperty: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        has "module" property that is not equal to "CommonJS":

        Delete the property, or change it to "CommonJS".
    `,
    optionalOptionHasNoValueForDefaultJSDocTag: (_: { commandName: string; optionName: string }): string => tagUnindent`
        The command with name:
        
            ${_.commandName}
        
        has option with name:
        
            ${_.optionName}
        
        that is optional and has no value for default JSDoc tag.
    `,
    providedFlagNameIsReserved: (_: {
        commandName: string;
        optionName: string;
        flagName: string;
    }): string => tagUnindent`
        Command with name:

            ${_.commandName}

        for option:

            ${_.optionName}

        has flag with name:

            ${_.flagName}

        that is reserved.

        Use a different character for flag.
    `,
    invalidPatternForCliJsDocTagValue: (_: { fnName: string; cliValue: string }): string => {
        const { cliJsDocValueValidPattern } = constants;
        return tagUnindent`
            Function with name:

                ${_.fnName}

            to be converted to command, has value for @CLI JSDoc tag:

                ${_.cliValue}

            that does not match the pattern:

                ${cliJsDocValueValidPattern.source}

        `;
    },
    moreThanOneJsDocCliTags: (_: { fnName: string }): string => tagUnindent`
        Function with name:

            ${_.fnName}

        to be converted to command, has more than one @CLI JSDoc tag, while it has to have only one.
    `,
    badBinObjectLiteral: (_: { packageJsonName: string }): string => tagUnindent`
        package.json has bin property that does not have property with name:
    
            ${_.packageJsonName}
    
        while it has to.
    `,
    get badPackageJsonInterface(): string {
        return tagUnindent`
            package.json object does not satisfy the following interfaces:

                version: string;
                name: string;
                bin:
                    | string
                    | {
                          [x: string]: string;
                      };

            while it has to.
        `;
    },
    get badTsConfig(): string {
        return tagUnindent`
            tsconfig.json does not satisfy the following interface:

                {
                    compilerOptions: {
                        outDir: string;
                        declarationDir?: string;
                        declaration: boolean;
                        module: string;
                    };
                }
        `;
    },
    badDeclarationDir: (_: { absolutePathToTsconfig: string }): string => tagUnindent`
        tsconfig.json in path:
    
            ${_.absolutePathToTsconfig}
    
        has declarationDir different from outDir, while they have to be the same.
    `,
    optionCanNotHaveReservedName: (commandName: string, name: string): string => tagUnindent`
        Command with name:
    
            ${commandName}
    
        has option with name:
    
            ${name}
    
        that is reserved.
    `,
};

export const internalErrorMessage = {
    get internalLibraryErrorMessage(): string {
        return tagUnindent`
            Something went wrong. If you have not used the library in a way
            it is not supposed to be used, then copy the call stack and open
            an issue here:
        
                https://github.com/lillallol/fn-to-cli/issues
        
        `;
    },
};
