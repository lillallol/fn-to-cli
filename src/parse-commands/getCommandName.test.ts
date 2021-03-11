import { isFunctionDeclaration } from "typescript";
import { createMockSourceFile } from "../test-utils/index";
import { getCommandName } from "./getCommandName";

describe(getCommandName.name, () => {
    test("it returns the name of the provided function declaration", () => {
        const fnName = "foo";
        const s = createMockSourceFile(`
            export function ${fnName}() {}
        `).statements[0];
        if (!isFunctionDeclaration(s)) throw Error();
        expect(getCommandName(s)).toBe(fnName);
    });
});
