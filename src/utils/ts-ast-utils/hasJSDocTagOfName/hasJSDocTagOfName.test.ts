import { JSDoc } from "typescript";
import { createMockSourceFile } from "../../../test-utils/index";
import { getJsDocOfAstNode } from "../getJSDocOfAstNode";
import { hasJSDocTagOfName } from "./hasJSDocTagOfName";

const s = getJsDocOfAstNode(
    createMockSourceFile(`
        /**
         * @public
        */
        const a = 1;
    `).statements[0]
);
if (s === undefined) throw Error();
const JSDoc: JSDoc = s[0];

describe(hasJSDocTagOfName.name, () => {
    it("returns true when the provided statement has the provided tag name", () => {
        expect(hasJSDocTagOfName(JSDoc, "public")).toBe(true);
    });
    it("returns false when the provided statement does not have the provided tag name", () => {
        expect(hasJSDocTagOfName(JSDoc, "private")).toBe(false);
    });
    it("returns false when the provided statement does not have jsDoc tags",() => {
        const s = getJsDocOfAstNode(
            createMockSourceFile(`
                /***/
                const a = 1;
            `).statements[0]
        );
        if (s === undefined) throw Error();
        const JSDoc: JSDoc = s[0];
        expect(hasJSDocTagOfName(JSDoc, "private")).toBe(false);
    })
});
