import { Statement } from "typescript";
import { getSourceFileOf } from "../getSourceFileOf/getSourceFileOf";

export function getStatementsOf(absolutePathToTsFile: string): Statement[] {
    return Array.from(getSourceFileOf(absolutePathToTsFile).statements);
}
