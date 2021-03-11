import { isDictionaryObject, tagUnindent } from "../utils/index";
import * as fs from "fs";

/**
 * @description
 * It also validates the tsconfig values :
 * - "compilerOptions.declarations"
 * - "compilerOptions.module"
 * - "compilerOptions.declarationDir"
 */
export function getRootDirAndOutDirFromTsconfig(absolutePathToTsconfig: string): { rootDir: string; outDir: string } {
    let toReturn: unknown;
    try {
        const toParse: string = fs.readFileSync(absolutePathToTsconfig, { encoding: "utf-8" });
        toReturn = JSON.parse(toParse);
    } catch {
        throw Error(_errorMessages.badTsConfig(absolutePathToTsconfig));
    }
    if (!isDictionaryObject(toReturn)) throw Error(_errorMessages.badTsConfigValue(absolutePathToTsconfig));
    const { compilerOptions } = toReturn;
    if (!isDictionaryObject(compilerOptions)) throw Error(_errorMessages.badCompilerOptions(absolutePathToTsconfig));
    const { rootDir, outDir, declarationDir, declaration, module } = compilerOptions;
    if (typeof declarationDir === "string" && declarationDir !== outDir) {
        throw Error(_errorMessages.badDeclarationDir(absolutePathToTsconfig));
    }
    if (typeof rootDir !== "string") throw Error(_errorMessages.badRootDir(absolutePathToTsconfig));
    if (typeof outDir !== "string") throw Error(_errorMessages.badOutDir(absolutePathToTsconfig));
    if (declaration !== true) throw Error(_errorMessages.badDeclarations(absolutePathToTsconfig));
    if (typeof module === "string" && module !== "CommonJS") {
        throw Error(_errorMessages.badModuleProperty(absolutePathToTsconfig));
    }
    return {
        outDir,
        rootDir,
    };
}

export const _errorMessages = {
    badTsConfig: (absolutePathToTsconfig: string): string => tagUnindent`
        Tried to parse the tsconfig in path:

            ${absolutePathToTsconfig}

        and failed.

        Maybe there are trailing commas in an array or an object?
    `,
    badTsConfigValue: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        was deserialized to a value that is not of "typeof" "object".
    `,
    badCompilerOptions: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        was deserialized to a value that its property "compilerOptions" is not of "typeof" "object".
    `,
    badRootDir: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        was deserialized to a value that its property "compilerOptions.rootDir" is not of string type.
    `,
    badOutDir: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        was deserialized to a value that its property "compilerOptions.outDir" is not of string type.
    `,
    badDeclarations: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        has "declarations" property that is not true.
    `,
    badDeclarationDir: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        has "declarationDir" property that is not equal to outDir path.

        Delete the property or change it to be equal to the outDir path:
    `,
    badModuleProperty: (absolutePathToTsconfig: string): string => tagUnindent`
        tsconfig.json in path:

            ${absolutePathToTsconfig}

        has "module" property that is not equal to "CommonJS":

        Delete the property, or change it to "CommonJS".
    `,
};
