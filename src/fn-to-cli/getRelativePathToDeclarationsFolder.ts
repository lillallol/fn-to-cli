import * as fs from "fs";
import * as json5 from "json5";
import { is } from "typescript-is";
import { errorMessages } from "../errorMessages";

/**
 * @description
 * It also validates the tsconfig values :
 * - "compilerOptions.declarations"
 * - "compilerOptions.module"
 * - "compilerOptions.declarationDir"
 */
export function getRelativePathsFromTsConfig(absolutePathToTsconfig: string): { outDir: string } {
    const tsConfigSrc: string = fs.readFileSync(absolutePathToTsconfig, { encoding: "utf-8" });
    const tsConfig: unknown = json5.parse(tsConfigSrc);

    if (
        !is<{
            compilerOptions: {
                outDir: string;
                declarationDir?: string;
                declaration: boolean;
                module: string;
            };
        }>(tsConfig)
    ) {
        throw Error(errorMessages.badTsConfig);
    }

    const {
        compilerOptions: { outDir, declarationDir, declaration, module },
    } = tsConfig;

    if (declaration !== true) throw Error(errorMessages.badDeclarations(absolutePathToTsconfig));
    if (module !== "CommonJS") throw Error(errorMessages.badModuleProperty(absolutePathToTsconfig));
    if (typeof declarationDir === "string" && declarationDir !== outDir) {
        throw Error(errorMessages.badDeclarationDir({ absolutePathToTsconfig }));
    }

    return {
        outDir,
    };
}
