import { parseCommands } from "../parse-commands/index";
import { tagUnindent } from "../utils/index";
import { getImportStatementsForCommandFns } from "./getImportStatements";
import * as path from "path";
import { getRootDirAndOutDirFromTsconfig } from "./getRootDirAndOutDirFromTsconfig";
import { createOutputFile } from "./createOutputFile";
import { getNameVersionBinFromPackageJSON } from "./getNameVersionBinFromPackageJSON";

/**
 * @description
 * Convert typescript functions to CLI.
 * 
 * Here is what you need to do:
 *
 * 1. add `@CLI` JSDoc tag comment in the functions you want to convert to CLI
 * 2. `tsc` your project
 * 3. execute from terminal:
 *
 *      fn-to-cli
 *
 * That's it.
 * 
 * If something goes wrong you will receive helpful error messages that will
 * guide you on resolving the error.
 *
 *
 *
 * Each function with the `@CLI` JSDoc tag has to:
 *
 * 1.  have a single parameter that is `TypeLiteral`, for example:
 *
 *       {
 *          param1 : string,
 *          param2 : boolean
 *       }
 *
 *     where each property can only be one of the following types:
 *
 *        string
 *        boolean
 *        number
 *        string[]
 *        boolean[]
 *        number[]
 *
 * 2.  be a function declaration statement, for example
 *
 *       // incorrect
 *       const foo = () => {
 *         //some code
 *       };
 *
 *       // correct
 *       function foo() {
 *         //some code
 *       }
 *
 * 3.  be named or default exported
 * 4.  have name
 * 5.  have description in its JSDoc comment via a `@description` tag or tag-less
 * 6.  same as above for each property in its parameter type signature
 * 7.  have `@default` JSDoc tag with proper initialization value for each optional
 *     parameter
 * 8.  be inside the `rootDir` directory as defined by the provided `tsconfig.json`
 * 9.  be in a `.ts` file
 *
 * The functions can have:
 *
 * 1. `@flag` JSDoc tag for any of its properties. It has to have a single letter
 *   as a value which can be used instead of the parameter names.
 * 2. `@private` JSDoc tag for any of its optional properties. These properties
 *   will not be visible in the documentation of the CLI and will not receive a
 *   value even if the user of the CLI provides one for them.
 *
 *
 *
 * The CLI generator works by searching deeply in the directory defined by the
 * property `compilerOptions.outDir` of `tsconfig.json`, for all the `.d.ts`
 * files that have functions with `@CLI` JSDoc tag. These functions become
 * commands to the generated CLI.
 *
 * The generated CLI is saved to the path defined by the `bin` property of
 * `package.json`,and imports js functions from the directories
 * `compilerOptions.outDir`, and `node_modules`, so it will not work if these
 * folders are missing or moved.
 * @CLI
 */
export function fnToCLI(_: {
    /**
     * @description
     * Path to `tsconfig.json`.
     * @default "./tsconfig.json"
     * @flag t
     */
    pathToTsconfig?: string;
    /**
     * @description
     * Path to `package.json`.
     * @default "./package.json"
     * @flag p
     */
    pathToPackageJson?: string;
    /**
     * @description
     * For one command CLI, it is optional to write the command name when using the CLI. Give `true` to disable that.
     * @default false
     * @flag s
     */
    strict?: boolean;
    /**
     * @description
     * Changes the paths to non node module paths for the functions that are imported from fn-to-cli node package.
     * Useful only when generating the CLI of fn-to-cli.
     * @private
     * @default false
     */
    development?: boolean;
}): void {
    let { development, strict, pathToTsconfig, pathToPackageJson } = _;

    if (pathToTsconfig === undefined) pathToTsconfig = "./tsconfig.json";
    if (development === undefined) development = false;
    if (strict === undefined) strict = false;
    if (pathToPackageJson === undefined) pathToPackageJson = "./package.json";

    const absolutePathToTsconfig = path.resolve(process.cwd(), pathToTsconfig);
    const { outDir } = getRootDirAndOutDirFromTsconfig(absolutePathToTsconfig);
    const absolutePathToOutDir = path.resolve(process.cwd(), outDir);
    const parsedCommands = parseCommands(absolutePathToOutDir);
    const absolutePathToPackageJson = path.resolve(process.cwd(), pathToPackageJson);
    const { name: packageName, version: packageVersion, bin } = getNameVersionBinFromPackageJSON(
        absolutePathToPackageJson
    );
    const absolutePathToBinFile = path.resolve(process.cwd(), bin);

    const outputFileSrcCode = tagUnindent`
        #!/usr/bin/env node
        
        // @ts-check

        ${[
            getImportStatementsForCommandFns({
                parsedCommands,
                absolutePathToOutput: absolutePathToBinFile,
            }),
        ]}

        const {cli} = require("${development ? "../dist/index.js" : "fn-to-cli"}");

        ${[
            tagUnindent`
                /**
                 * @type {import("${development ? "../dist/types.js" : "fn-to-cli"}").parsedCommandForCli[]}
                */
            `,
        ]}
        const parsedCommands = [
            ${[
                parsedCommands
                    .map(({ commandName, options, description }) => {
                        return tagUnindent`
                        {
                            description : ${JSON.stringify(description)},
                            command : ${commandName},
                            options : 
                                ${[JSON.stringify(options, undefined, "    ")]}
                        }
                    `;
                    })
                    .join(",\n"),
            ]}
        ];
        const {argv} = process;
        const cliVersion = "${packageVersion}";
        const cliName = "${packageName}";
        const strict = ${JSON.stringify(strict)};
        cli({
            parsedCommands,
            argv,
            cliVersion,
            cliName,
            strict
        });
    `;

    createOutputFile({
        absolutePathToOutput: absolutePathToBinFile,
        outputFileSrcCode,
    });
}
