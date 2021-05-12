import { pathCanBeAccessed } from "../utils/index";
import * as fs from "fs";
import * as path from "path";
import { errorMessages } from "../errorMessages";

export function createBinFile(_: { absolutePathToOutput: string; outputFileSrcCode: string }): void {
    const { absolutePathToOutput, outputFileSrcCode } = _;
    if (pathCanBeAccessed(absolutePathToOutput)) {
        throw Error(errorMessages.pathToBinAlreadyExists(absolutePathToOutput));
    }
    if (!absolutePathToOutput.endsWith(".js")) {
        throw Error(errorMessages.pathToBinFileHasToEndWithJs(absolutePathToOutput));
    }
    fs.mkdirSync(path.dirname(absolutePathToOutput), { recursive: true });
    fs.writeFileSync(absolutePathToOutput, outputFileSrcCode);
}
