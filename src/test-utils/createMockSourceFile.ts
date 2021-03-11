import { createSourceFile, ScriptTarget, SourceFile } from "typescript";

/**
 * @description
 * 
*/
export function createMockSourceFile(code: string): SourceFile {
    return createSourceFile("mock.ts", code, ScriptTarget.Latest);
}
