import * as path from "path";
import { internalErrorMessage } from "../errorMessages";
import { tagUnindent } from "../utils/index";

export function getImportStatementsForCommandFns(_: {
    parsedCommands: { absolutePathToFile: string; exportValue: "default" | "named"; functionName: string; }[];
    absolutePathToOutput: string;
}): string {
    const { absolutePathToOutput, parsedCommands } = _;
    const absolutePathsOfInputs = parsedCommands.map(({ absolutePathToFile }) => absolutePathToFile);
    const moduleSpecifiers = absolutePathsOfInputs.map(
        (absolutePathToInput) =>
            "./" +
            path.relative(path.dirname(absolutePathToOutput), absolutePathToInput).slice(0, ".d.ts".length * -1) +
            ".js"
    );

    return parsedCommands
        .map(({ exportValue, functionName }, i) => {
            if (exportValue === "default") {
                return tagUnindent`
                    const {default : ${functionName}} = require("${moduleSpecifiers[i]}");
                `;
            }
            if (exportValue === "named") {
                return tagUnindent`
                    const {${functionName}} = require("${moduleSpecifiers[i]}");
                `;
            }
            throw Error(internalErrorMessage.internalLibraryErrorMessage);
        })
        .join("\n");
}
