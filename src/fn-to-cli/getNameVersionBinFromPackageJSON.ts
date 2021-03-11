import { isDictionaryObject, tagUnindent } from "../utils";
import * as fs from "fs";

export function getNameVersionBinFromPackageJSON(
    absolutePathToPackageJSON: string
): { version: string; name: string; bin: string } {
    const packageJson = (() => {
        try {
            return JSON.parse(fs.readFileSync(absolutePathToPackageJSON, { encoding: "utf-8" }));
        } catch {
            throw Error(_errorMessages.packageJsonNotSerializable(absolutePathToPackageJSON));
        }
    })();
    if (!isDictionaryObject(packageJson)) throw Error(_errorMessages.badPackageJsonValue(absolutePathToPackageJSON));
    const { version, name, bin } = packageJson;
    if (typeof version !== "string") throw Error(_errorMessages.badVersionProperty(absolutePathToPackageJSON));
    if (typeof name !== "string") throw Error(_errorMessages.badNameProperty(absolutePathToPackageJSON));
    if (typeof bin !== "string") throw Error(_errorMessages.badBinProperty(absolutePathToPackageJSON));
    return { version, name, bin };
}

export const _errorMessages = {
    packageJsonNotSerializable: (absolutePathToPackageJSON: string): string => tagUnindent`
        Tried to deserialize:

            ${absolutePathToPackageJSON}

        and failed.
    `,
    badPackageJsonValue: (absolutePathToPackageJSON: string): string => tagUnindent`
        package.json in path:

            ${absolutePathToPackageJSON}

        was deserialized to a value that is not of "typeof" "object".
    `,
    badVersionProperty: (absolutePathToPackageJSON: string): string => tagUnindent`
        package.json in path:

            ${absolutePathToPackageJSON}

        was deserialized to a value that its property "version" is not of type string.
    `,
    badNameProperty: (absolutePathToPackageJSON: string): string => tagUnindent`
        package.json in path:

            ${absolutePathToPackageJSON}

        was deserialized to a value that its property "name" is not of type string.
    `,
    badBinProperty: (absolutePathToPackageJSON: string): string => tagUnindent`
        package.json in path:

            ${absolutePathToPackageJSON}

        was deserialized to a value that its property "bin" is not of type string.
    `,
};
