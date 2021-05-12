import { errorMessages } from "../errorMessages";
import { parsedCommandForCli } from "../types";
import { cliFactory, ICli } from "./cli";
import { printCliCommandsDocumentation } from "./printCliCommandsDocumentation";
import { printCliOptionsDocumentation } from "./printCliOptionsDocumentation";

type hasBeenCalled = {
    printCliCommandsDocumentation: boolean;
    printCliOptionsDocumentation: boolean;
    foo: { [x: string]: unknown } | null;
    bar: { [x: string]: unknown } | null;
};

let hasBeenCalled: hasBeenCalled;
let cli: ICli;

const parsedCommands: parsedCommandForCli[] = [
    {
        description: "Some tag less description for command foo.",
        command: function foo(_: { a: string; b?: boolean }): void {
            hasBeenCalled.foo = _;
        },
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
        commandName: "foo",
    },
    {
        description: `Some tag full description for command \`bar\`.`,
        command: function bar(_: { c: boolean; d?: boolean }): void {
            hasBeenCalled.bar = _;
        },
        commandName: "baz",
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
];

beforeEach(() => {
    hasBeenCalled = {
        printCliCommandsDocumentation: false,
        printCliOptionsDocumentation: false,
        foo: null,
        bar: null,
    };
    cli = cliFactory(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (arg: any): string => {
            hasBeenCalled.printCliCommandsDocumentation = true;
            return printCliCommandsDocumentation(arg);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (arg: any): string => {
            hasBeenCalled.printCliOptionsDocumentation = true;
            return printCliOptionsDocumentation(arg);
        }
    );
});

describe(cliFactory.name, () => {
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("[-h|--help]", ({ keyword }) => {
        cli({
            parsedCommands,
            argv: ["mock", "mock", keyword],
            cliName: "myCustomCliName",
            cliVersion: "myCustomCliVersion",
            strict: false,
        });
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: true,
            printCliOptionsDocumentation: false,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<command> [-h|--help]", ({ keyword }) => {
        cli({
            parsedCommands,
            argv: ["mock", "mock", "foo", keyword],
            cliName: "myCustomCliName",
            cliVersion: "myCustomCliVersion",
            strict: false,
        });
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: true,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<non-valid-command> [-h|--help]", ({ keyword }) => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "fo", keyword],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: false,
            })
        ).toThrow(errorMessages.providedCommandDoesNotExist("fo", ["foo", "baz"]));
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: false,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<command> [<option>|<flag>]+ [-h|--help]", ({ keyword }) => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "foo", "--a", "-V", keyword],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: false,
            })
        ).not.toThrow();
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: true,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<command> [<non-valid-option>|<flag>]+ [-h|--help]", () => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "foo", "--bb", "-V", "--help"],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: false,
            })
        ).toThrow(errorMessages.helpGotBadOptionFlag("bb", "foo", false));
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: true,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<command> [<option>|<non-valid-flag>]+ [-h|--help]", () => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "foo", "-f", "--a", "--help"],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: false,
            })
        ).toThrow(errorMessages.helpGotBadOptionFlag("f", "foo", true));
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: true,
            bar: null,
            foo: null,
        });
    });
    test.each<[{ keyword: "--help" | "-h" }]>([
        [
            {
                keyword: "--help",
            },
        ],
        [
            {
                keyword: "-h",
            },
        ],
    ])("<command> <non-option-non-flag> [-h|--help]", () => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "foo", "fa", "--help"],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: false,
            })
        ).toThrow(errorMessages.helpGotBadArgument("fa"));
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: true,
            bar: null,
            foo: null,
        });
    });

    // ####################################################

    it("<command> [(<option>|<flag>) <value>]+", () => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "foo", "--a", `"A"`, "--b", "true"],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: true,
            })
        ).not.toThrow();
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: false,
            bar: null,
            foo: {
                a: "A",
                b: true,
            },
        });
    });
    it("multi-command : [(<option>|<flag>) <value>]+", () => {
        expect(() =>
            cli({
                parsedCommands,
                argv: ["mock", "mock", "--a", `"A"`, "--b", "true"],
                cliName: "myCustomCliName",
                cliVersion: "myCustomCliVersion",
                strict: true,
            })
        ).toThrow(errorMessages.youHaveNotProvidedACommand(["foo", "baz"]));
        expect(hasBeenCalled).toEqual<hasBeenCalled>({
            printCliCommandsDocumentation: false,
            printCliOptionsDocumentation: false,
            bar: null,
            foo: null,
        });
    });
    // it.todo("does not throw error when given or not given command name for single command CLI non strict mode",() => {});
    // it.todo("does not throw error when single command strict mode is not given command",() => {});
    describe("it throws error", () => {
        test("for non existing flag", () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", `"A"`, "-bb", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.flagDoesNotExistForGivenCommand("bb", "foo"));
        });
        test("for non existing option", () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--aa", `"A"`, "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.invalidOptionName("aa", "foo"));
        });
        test("when a required parameter has not been provided a value", () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.requiredParametersMissingValues(["a"]));
        });
        test(`when a parameter does not start with "-"`, () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", `"A"`, "b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.invalidArgumentName("b"));
        });
        test(`when an option does not exist for the given command`, () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", `"A"`, "--bb", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.invalidOptionName("bb", "foo"));
        });
        test(`when a parameter is given two or more values`, () => {
            expect(() =>
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", `"A"`, "--b", "true", "-V", "false"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                })
            ).toThrow(errorMessages.optionFlagGivenValueMoreThanOnce("b", "V"));
        });
    });
});
