import { parsedCommandForFnToCli } from "../../types";
import { createFs } from "../../test-utils/index";
import { tagUnindent } from "../../utils/index";
import { parseCommands } from "./parseCommands";
import * as path from "path";

describe(parseCommands.name, () => {
    it("parses properly the commands of the input files", () => {
        const paths = Object.values(
            createFs(__dirname, {
                folder: "test1",
                fs: {
                    "input1.mock.ts": tagUnindent`
                        /**
                         * Some tag less description for command foo.
                         * @CLI
                        */
                        export function foo(_ : {
                            /**
                             * @description
                             * Some tag full description for option \`a\` of command \`foo\`.
                            */
                            a : string,
                            /**
                             * Some tag less description for option \`b\` of command \`foo\`.
                             * @default true
                             * @flag v
                            */
                            b? : boolean
                        }):void {
                            _;
                        }
                    `,
                    "input2.mock.ts": tagUnindent`
                        /**
                         * @description
                         * Some tag full description for command \`bar\`.
                         * @CLI
                         */
                        export default function bar(_: {
                            /**
                             * Some tag less description for option \`c\` of command \`bar\`.
                             */
                            c: boolean;
                            /**
                             * Some tag less description for option \`d\` of command \`bar\`.
                             * @private
                             * @default true
                             */
                            d?: boolean;
                        }): void {
                            _;
                        }
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
                commandName: "bar",
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
});
