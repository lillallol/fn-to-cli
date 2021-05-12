import { parsedCommandForFnToCli } from "../../types";
import { createFs } from "../../test-utils/index";
import { tagUnindent } from "../../utils/index";
import { parseCommands } from "./parseCommands";
import * as path from "path";
import { errorMessages } from "../../errorMessages";
import { constants } from "../../constants";

describe(parseCommands.name, () => {
    it("parses properly the commands of the input files", () => {
        const paths = Object.values(
            createFs(__dirname, {
                folder: "test1",
                fs: {
                    "input1.mock.d.ts": tagUnindent`
                        /**
                         * Some tag less description for command foo.
                         * @CLI
                        */
                        export declare function foo(_ : {
                            /**
                             * @description
                             * Some tag full description for option \`a\` of command \`foo\`.
                            */
                            a : string,
                            /**
                             * Some tag less description for option \`b\` of command \`foo\`.
                             * @default true
                             * @flag V
                            */
                            b? : boolean
                        }):void;
                    `,
                    "input2.mock.d.ts": tagUnindent`
                        /**
                         * @description
                         * Some tag full description for command \`bar\`.
                         * @CLI baz
                         */
                        export default function bar(_: {
                            /**
                             * Some tag less description for option \`c\` of command \`bar\`.
                             */
                            c: boolean;
                            /**
                             * Some tag less description for option \`d\` of command \`bar\`.
                             * @cliPrivate
                             * @default true
                             */
                            d?: boolean;
                        }): void;
                    `,
                },
            })
        );
        expect(parseCommands(path.dirname(paths[0]))).toEqual<parsedCommandForFnToCli[]>([
            {
                description: "Some tag less description for command foo.",
                commandName: "foo",
                exportValue: "named",
                absolutePathToFile: paths[0],
                functionName: "foo",
                options: [
                    {
                        description: `Some tag full description for option \`a\` of command \`foo\`.`,
                        isOptional: false,
                        optionName: "a",
                        type: "string",
                        defaultValue: undefined,
                        flag: undefined,
                    },
                    {
                        description: `Some tag less description for option \`b\` of command \`foo\`.`,
                        isOptional: true,
                        optionName: "b",
                        type: "boolean",
                        defaultValue: "true",
                        flag: "V",
                    },
                ],
            },
            {
                description: `Some tag full description for command \`bar\`.`,
                commandName: "baz",
                functionName: "bar",
                exportValue: "default",
                absolutePathToFile: paths[1],
                options: [
                    {
                        description: `Some tag less description for option \`c\` of command \`bar\`.`,
                        isOptional: false,
                        optionName: "c",
                        type: "boolean",
                        defaultValue: undefined,
                        flag: undefined,
                    },
                ],
            },
        ]);
    });
    it(
        "throw error when there are more than one private jsdoc tag in an optional property",
        unitTestForThrow({
            file: tagUnindent`
            /**
             * @description
             * Some description.
             * @CLI
            */
            export declare function foo(_ : {
                /**
                 * @description
                 * Some description.
                 * @default 10
                 * @cliPrivate
                 * @cliPrivate
                */
                a? : number
            })
        `,
            errorMessage: () => errorMessages.moreThanOnePrivateJSDocTag("foo", "a"),
        })
    );
    it(
        "throw error when there non optional property has private jsdoc tag",
        unitTestForThrow({
            file: tagUnindent`
            /**
             * @description
             * Some description.
             * @CLI
            */
            export declare function foo(_ : {
                /**
                 * @description
                 * Some description.
                 * @default 10
                 * @cliPrivate
                */
                a : number
            })
        `,
            errorMessage: () => errorMessages.nonOptionalOptionCanNotBePrivate("foo", "a"),
        })
    );
    it(
        "throws error when the private jsdoc tag has value",
        unitTestForThrow({
            file: tagUnindent`
            /**
             * @description
             * Some description.
             * @CLI
            */
            export declare function foo(_ : {
                /**
                 * @description
                 * Some description.
                 * @default 10
                 * @cliPrivate "some value"
                */
                a : number
            })
        `,
            errorMessage: () => errorMessages.privateJSDocTagHasValue("foo", "a", '"some value"'),
        })
    );
    it(
        "throws error when option has no type",
        unitTestForThrow({
            file: tagUnindent`
            /**
             * @description
             * Some description.
             * @CLI
            */
            export declare function foo(_ : {
                /**
                 * @description
                 * Some description.
                 * @default 10
                */
                a
            })
        `,
            errorMessage: () => errorMessages.optionMemberHasNoType("a", "foo"),
        })
    );
    it.each<[{ reservedName: string }]>(constants.reservedOptionNames.map((reservedName) => [{ reservedName }]))(
        "throws error when option has reserved name",
        ({ reservedName }) =>
            unitTestForThrow({
                file: tagUnindent`
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    export declare function foo(_ : {
                        /**
                         * @description
                         * Some description.
                        */
                        ${reservedName} : number
                    })
                `,
                errorMessage: () => errorMessages.optionCanNotHaveReservedName("foo", reservedName),
            })()
    );
    it(
        "throws error when a command has more than one jsDoc comment",
        unitTestForThrow({
            file: tagUnindent`
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    export declare function foo(_ : {
                        /**
                         * @description
                         * Some description.
                         * @flag a
                        */
                        a : number
                    })
                `,
            errorMessage: () =>
                errorMessages.astNodeHasMoreThanOneJSDocComment({
                    commandName: "foo",
                    optionName: undefined,
                }),
        })
    );
    it(
        "throws error when an option has more than one jsDoc comment",
        unitTestForThrow({
            file: tagUnindent`
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    export declare function foo(_ : {
                        /**
                         * @description
                         * Some description.
                         * @flag a
                        */
                        /**
                         * @description
                         * Some description.
                         * @flag a
                        */
                        a : number
                    })
                `,
            errorMessage: () =>
                errorMessages.astNodeHasMoreThanOneJSDocComment({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has no jsDoc comment",
        unitTestForThrow({
            file: tagUnindent`
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    export declare function foo(_ : {
                        a : number
                    })
                `,
            errorMessage: () =>
                errorMessages.astNodeHasNoJSDocComment({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has more than one flag jsdoc tag",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @flag a
                     * @flag a
                    */
                    a : number
                })
            `,
            errorMessage: () =>
                errorMessages.moreThanOneJSDocFlagTag({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has flag jsdoc tag with no value",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @flag
                    */
                    a : number
                })
            `,
            errorMessage: () =>
                errorMessages.flagJSDocTagHasNoValue({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has flag with value that is not a single letter",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @flag aa
                    */
                    a : number
                })
            `,
            errorMessage: () =>
                errorMessages.flagHasToBeOneLetter({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it.each<[{ reservedFlagName: string }]>(
        constants.reservedFlagNames.map((reservedFlagName) => [{ reservedFlagName }])
    )("throws error when option has reserved flag", ({ reservedFlagName }) =>
        unitTestForThrow({
            file: tagUnindent`
                    /**
                     * @description
                     * Some description.
                     * @CLI
                    */
                    export declare function foo(_ : {
                        /**
                         * @description
                         * Some description.
                         * @flag ${reservedFlagName}
                        */
                        a : number
                    })
                `,
            errorMessage: () =>
                errorMessages.providedFlagNameIsReserved({
                    commandName: "foo",
                    optionName: "a",
                    flagName: reservedFlagName,
                }),
        })()
    );
    it(
        "throws error when an option has more than one default jsDoc tag",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default
                     * @default
                    */
                    a : number
                })
            `,
            errorMessage: () => errorMessages.propertyHasMoreThanOneDefaultJSDocTagsInMember("a", "foo"),
        })
    );
    it(
        "throws error when an optional option has no default jsDoc tag",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                    */
                    a? : number
                })
            `,
            errorMessage: () => errorMessages.optionalPropertyHasNoDefaultJSDocTag("a", "foo"),
        })
    );
    it(
        "throws error when an non optional option has default jsDoc tag",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a : number
                })
            `,
            errorMessage: () => errorMessages.nonOptionalPropertyHasDefaultJSDocTag("a", "foo"),
        })
    );
    it(
        "throws error when an non optional option does not have value for default jsDoc",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.optionalOptionHasNoValueForDefaultJSDocTag({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when a function has more than one @CLI jsdoc tag",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.moreThanOneJsDocCliTags({
                    fnName: "foo",
                }),
        })
    );
    it(
        "throws error when a function has @CLI jsdoc tag with invalid pattern",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI f oo
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.invalidPatternForCliJsDocTagValue({
                    fnName: "foo",
                    cliValue: "f oo",
                }),
        })
    );
    it(
        "throws error when a function with @CLI jsdoc tag is not exported",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI foo
                */
                declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () => errorMessages.commandHasToBeExported("foo"),
        })
    );
    it(
        "throws error when no function with @CLI jsdoc tag is located",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                */
                declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.noCLIFunctionsWhereFound(path.resolve(__dirname, `./test/test${folderCount}`)),
        })
    );
    it(
        "throws error when a command has more than one @description jsdoc tags",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @description
                 * @CLI foo
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.astNodeHasMoreThanOneJSDocDescriptionTags({
                    commandName: "foo",
                    optionName: undefined,
                }),
        })
    );
    it(
        "throws error when a command has more than one @description jsdoc tags",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * hello world
                 * @description
                 * Some description.
                 * @CLI foo
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.astNodeHasBothATagLessAndTagFullDescription({
                    commandName: "foo",
                    optionName: undefined,
                }),
        })
    );
    it(
        "throws error when a command with no description jsdoc tag value",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * @CLI foo
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () =>
                errorMessages.astNodeHasNoJSDocDescriptionValue({
                    commandName: "foo",
                    optionName: undefined,
                }),
        })
    );
    it(
        "throws error when a command has no parameters",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo()
            `,
            errorMessage: () => errorMessages.fnToCLIHasToHaveOneParameter("foo"),
        })
    );
    it(
        "throws error when a command has more than one parameters",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(a : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                },b : {
                    /**
                     * @description
                     * Some description.
                     * @default 1
                    */
                    a? : number
                })
            `,
            errorMessage: () => errorMessages.fnToCLIHasToHaveOneParameter("foo"),
        })
    );
    it(
        "throws error when a command has not type for its parameter",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * @CLI foo
                */
                export declare function foo(_)
            `,
            errorMessage: () => errorMessages.invalidTypeParameterForFunctionConvertToCLI("foo"),
        })
    );
    it(
        "throws error when a command has an option that is function",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                    */
                    a(): void
                })
            `,
            errorMessage: () => errorMessages.memberIsNotPropertySignature({ commandName: "foo", optionName: "a" }),
        })
    );
    it(
        "throws error when a command name is shared by two or more different commands",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export declare function foo(_ : {
                    /**
                     * @description
                     * Some description.
                    */
                    a:string
                });
                /**
                 * @description
                 * Some description.
                 * @CLI foo
                */
                export declare function bar(_ : {
                    /**
                     * @description
                     * Some description.
                    */
                    a:string
                });
            `,
            errorMessage: () => errorMessages.commandNameCollides("foo"),
        })
    );
    it(
        "throws error when a command has no name",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export default function (_ : {
                    /**
                     * @description
                     * Some description.
                    */
                    a:string
                });
            `,
            errorMessage: () =>
                errorMessages.commandHasNoName(path.resolve(__dirname, `./test/test${folderCount}/index.mock.d.ts`)),
        })
    );
    it(
        "throws error when an option has description jsdoc tag with no value",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export default function foo (_ : {
                    /**
                     * @description
                    */
                    a:string
                });
            `,
            errorMessage: () =>
                errorMessages.astNodeHasNoJSDocDescriptionValue({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has more than one description jsdoc tags",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export default function foo (_ : {
                    /**
                     * @description 
                     * Some description.
                     * @description 
                     * Some description.
                    */
                    a:string
                });
            `,
            errorMessage: () =>
                errorMessages.astNodeHasMoreThanOneJSDocDescriptionTags({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    it(
        "throws error when an option has both a tag less and a tag full description value",
        unitTestForThrow({
            file: tagUnindent`
                /**
                 * @description
                 * Some description.
                 * @CLI
                */
                export default function foo (_ : {
                    /**
                     * Some description.
                     * @description 
                     * Some description.
                    */
                    a:string
                });
            `,
            errorMessage: () =>
                errorMessages.astNodeHasBothATagLessAndTagFullDescription({
                    commandName: "foo",
                    optionName: "a",
                }),
        })
    );
    // it("throws error when the provided path to the folder to search for function to convert to cli can not be accessed", () => {
    //     const nonAccessibleInputPath: string = path.resolve(__dirname, "./non-existing-folder");
    //     expect(() => parseCommands(nonAccessibleInputPath)).toThrow(
    //         errorMessages.inputCanNotBeAccessed(nonAccessibleInputPath)
    //     );
    // });
});

let folderCount = 1;

function unitTestForThrow(_: { file: string; errorMessage: () => string }): () => void {
    return () => {
        const { errorMessage, file } = _;
        folderCount++;
        const absolutePathToMockFile: string = Object.values(
            createFs(__dirname, {
                folder: "test" + String(folderCount),
                fs: {
                    "index.mock.d.ts": file,
                },
            })
        )[0];
        expect(() => parseCommands(path.dirname(absolutePathToMockFile))).toThrow(errorMessage());
    };
}
