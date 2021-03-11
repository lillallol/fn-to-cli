import { Statement, SyntaxKind } from "typescript";

export function hasDefaultModifier(s: Statement): boolean {
    return !!s.modifiers?.some((m) => m.kind === SyntaxKind.DefaultKeyword);
}