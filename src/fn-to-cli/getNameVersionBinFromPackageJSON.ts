import * as fs from "fs";
import * as JSON5 from "json5";
import { is } from "typescript-is";
import { errorMessages, internalErrorMessage } from "../errorMessages";

export function getNameVersionBinFromPackageJSON(
    absolutePathToPackageJSON: string
): { version: string; name: string; bin: string } {
    const packageJsonFileSrc = fs.readFileSync(absolutePathToPackageJSON, { encoding: "utf-8" });
    const packageJson = JSON5.parse(packageJsonFileSrc);
    if (
        !is<{
            version: string;
            name: string;
            bin:
                | string
                | {
                      [x: string]: string;
                  };
        }>(packageJson)
    ) {
        throw Error(errorMessages.badPackageJsonInterface);
    }
    const { version, name, bin: _bin } = packageJson;
    const bin: string = (() => {
        if (typeof _bin === "string") return _bin;
        if (typeof _bin === "object" && _bin !== null) {
            const toReturn: string = _bin[name];
            if (typeof toReturn !== "string") {
                throw Error(errorMessages.badBinObjectLiteral({ packageJsonName: name }));
            }
            return toReturn;
        }
        throw Error(internalErrorMessage.internalLibraryErrorMessage);
    })();
    return { version, name, bin };
}
