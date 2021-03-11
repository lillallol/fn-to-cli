import { pathCanBeAccessed } from "../utils/index";
import { tagUnindent } from "../utils/index";
import * as fs from "fs";
import * as path from "path";

export function createOutputFile(_: { absolutePathToOutput: string; outputFileSrcCode: string }): void {
    const { absolutePathToOutput, outputFileSrcCode } = _;
    if (pathCanBeAccessed(absolutePathToOutput)) {
        throw Error(_errorMessages.pathAlreadyExists(absolutePathToOutput));
    }
    if (!absolutePathToOutput.endsWith(".js")) {
        throw Error(_errorMessages.pathDoesEndWithJs(absolutePathToOutput));
    }
    fs.mkdirSync(path.dirname(absolutePathToOutput), { recursive: true });
    fs.writeFileSync(absolutePathToOutput, outputFileSrcCode);
}

export const _errorMessages = {
    pathAlreadyExists: (absolutePathToOutput: string): string => tagUnindent`
        Path to output:

            ${absolutePathToOutput}

        is already a file.

        Change the output path or delete the file.
    `,
    pathDoesEndWithJs: (absolutePathToOutput: string): string => tagUnindent`
        Path to output:

            ${absolutePathToOutput}

        does end with ".js".
    `,
};
