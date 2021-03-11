import { Statement, SyntaxKind } from "typescript";

export function hasExportModifier(s: Statement): boolean {
    return !!s.modifiers?.some((m) => m.kind === SyntaxKind.ExportKeyword);
}
