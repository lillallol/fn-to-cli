import * as path from "path";
import { internalLibraryErrorMessage, tagUnindent } from "../utils/index";

export function getImportStatementsForCommandFns(_: {
    parsedCommands: { absolutePathToFile: string; exportValue: "default" | "named"; commandName: string }[];
    absolutePathToOutput: string;
}): string {
    const { absolutePathToOutput, parsedCommands } = _;
    const absolutePathsOfInputs = parsedCommands.map(({ absolutePathToFile }) => absolutePathToFile);
    //@TODO I have no clue if this is gonna work for windows
    const moduleSpecifiers = absolutePathsOfInputs.map(
        (absolutePathToInput) =>
            "./" +
            path.relative(path.dirname(absolutePathToOutput), absolutePathToInput).slice(0, ".d.ts".length * -1) +
            ".js"
    );

    return parsedCommands
        .map(({ exportValue, commandName: name }, i) => {
            if (exportValue === "default") {
                return tagUnindent`
                    const {default : ${name}} = require("${moduleSpecifiers[i]}");
                `;
            }
            if (exportValue === "named") {
                return tagUnindent`
                    const {${name}} = require("${moduleSpecifiers[i]}");
                `;
            }
            throw Error(internalLibraryErrorMessage);
        })
        .join("\n");
}
