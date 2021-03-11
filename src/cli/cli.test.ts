//@TODO I should test that the documentation for certain properties is printed
//@TODO this test are bad need to update them, add more helpful descriptions

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
                defaultValue: true,
                flag: "v",
            },
        ],
    },
    {
        description: `Some tag full description for command \`bar\`.`,
        command: function bar(_: { c: boolean; d?: boolean }): void {
            hasBeenCalled.bar = _;
        },
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
    describe("<cli-name> [-h|--help]", () => {
        describe("strict mode", () => {
            test("multi command cli", () => {
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "--help"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: true,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: null,
                });
            });
            test("single command", () => {
                cli({
                    parsedCommands: [parsedCommands[0]],
                    argv: ["mock", "mock", "--help"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: true,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: null,
                });
            });
        });
        describe("non strict mode", () => {
            test("multi command cli", () => {
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "--help"],
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
            test("single command cli", () => {
                cli({
                    parsedCommands: [parsedCommands[0]],
                    argv: ["mock", "mock", "--help"],
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
        });
    });
    describe("<cli-name> <value>+ [-h|--help]", () => {
        describe("strict mode", () => {
            describe("for multi command cli", () => {
                test("<command> --help", () => {
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--help"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    });
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: true,
                        bar: null,
                        foo: null,
                    });
                });
                test("<non-valid-command>+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands,
                            argv: ["mock", "mock", "fo", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: true,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
                test("[<option>|<flag>]+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands,
                            argv: ["mock", "mock", "--a", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: true,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
            });
            describe("for single command cli", () => {
                test("<command> --help", () => {
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--help"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    });
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: true,
                        bar: null,
                        foo: null,
                    });
                });
                test("<non-valid-command>+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands: [parsedCommands[0]],
                            argv: ["mock", "mock", "fo", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: true,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
                test("[<option>|<flag>]+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands: [parsedCommands[0]],
                            argv: ["mock", "mock", "--a", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: true,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
            });
        });
        describe("non strict mode", () => {
            describe("for multi command cli", () => {
                test("<command> --help", () => {
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--help"],
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
                test("<non-valid-command>+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands,
                            argv: ["mock", "mock", "fo", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: false,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
                test("[<option>|<flag>]+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands,
                            argv: ["mock", "mock", "--a", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: false,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: false,
                        bar: null,
                        foo: null,
                    });
                });
            });
            describe("for single command cli", () => {
                test("<command> --help", () => {
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--help"],
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
                test("<non-valid-command>+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands: [parsedCommands[0]],
                            argv: ["mock", "mock", "fo", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: false,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: true,
                        bar: null,
                        foo: null,
                    });
                });
                test("[<option>|<flag>]+ --help", () => {
                    expect(() =>
                        cli({
                            parsedCommands: [parsedCommands[0]],
                            argv: ["mock", "mock", "--aa", "--help"],
                            cliName: "myCustomCliName",
                            cliVersion: "myCustomCliVersion",
                            strict: false,
                        })
                    ).toThrow();
                    expect(hasBeenCalled).toEqual<hasBeenCalled>({
                        printCliCommandsDocumentation: false,
                        printCliOptionsDocumentation: true,
                        bar: null,
                        foo: null,
                    });
                });
            });
        });
    });
    describe("<cli-name> <value>+", () => {
        describe("strict mode", () => {
            test("multi command cli", () => {
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", "A", "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: false,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: {
                        a: "A",
                        b: true,
                    },
                });
                expect(() =>
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
            });
            test("single command cli", () => {
                cli({
                    parsedCommands: [parsedCommands[0]],
                    argv: ["mock", "mock", "foo", "--a", "A", "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: false,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: {
                        a: "A",
                        b: true,
                    },
                });
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "--b", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
            });
        });
        describe("non strict mode", () => {
            test("multi command cli", () => {
                cli({
                    parsedCommands,
                    argv: ["mock", "mock", "foo", "--a", "A", "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: true,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: false,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: {
                        a: "A",
                        b: true,
                    },
                });
                expect(() =>
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands,
                        argv: ["mock", "mock", "foo", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: true,
                    })
                ).toThrow();
            });
            test("single command cli", () => {
                cli({
                    parsedCommands: [parsedCommands[0]],
                    argv: ["mock", "mock", "foo", "--a", "A", "--b", "true"],
                    cliName: "myCustomCliName",
                    cliVersion: "myCustomCliVersion",
                    strict: false,
                });
                expect(hasBeenCalled).toEqual<hasBeenCalled>({
                    printCliCommandsDocumentation: false,
                    printCliOptionsDocumentation: false,
                    bar: null,
                    foo: {
                        a: "A",
                        b: true,
                    },
                });
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "--b", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: false,
                    })
                ).not.toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: false,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "--b", "1"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: false,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "foo", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: false,
                    })
                ).toThrow();
                expect(() =>
                    cli({
                        parsedCommands: [parsedCommands[0]],
                        argv: ["mock", "mock", "--a", "A", "-bb", "true"],
                        cliName: "myCustomCliName",
                        cliVersion: "myCustomCliVersion",
                        strict: false,
                    })
                ).toThrow();
            });
        });
    });
});
