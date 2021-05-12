import * as path from "path";

import { parseCommands } from "../parse-commands/index";
import { tagUnindent } from "../utils/index";
import { getImportStatementsForCommandFns } from "./getImportStatements";
import { getRelativePathsFromTsConfig } from "./getRelativePathToDeclarationsFolder";
import { createBinFile } from "./createBinFile";
import { getNameVersionBinFromPackageJSON } from "./getNameVersionBinFromPackageJSON";

/**
 * @description
 * Converts typescript functions to CLI.
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
     * @default false
     * @cliPrivate
     */
    development?: boolean;
}): void {
    let { development, strict, pathToTsconfig, pathToPackageJson } = _;

    if (pathToTsconfig === undefined) pathToTsconfig = "./tsconfig.json";
    if (development === undefined) development = false;
    if (strict === undefined) strict = false;
    if (pathToPackageJson === undefined) pathToPackageJson = "./package.json";

    const absolutePathToTsconfig = path.resolve(process.cwd(), pathToTsconfig);
    const { outDir } = getRelativePathsFromTsConfig(absolutePathToTsconfig);
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
                    .map(({ commandName, options, description, functionName }) => {
                        return tagUnindent`
                            {
                                description : ${JSON.stringify(description)},
                                commandName : "${commandName}",
                                command : ${functionName},
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

    createBinFile({
        absolutePathToOutput: absolutePathToBinFile,
        outputFileSrcCode,
    });
}
