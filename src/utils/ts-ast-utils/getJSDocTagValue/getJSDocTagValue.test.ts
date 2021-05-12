import { JSDoc } from "typescript";
import { createMockSourceFile } from "../../../test-utils/index";
import { tagUnindent } from "../../es-utils/tagUnindent";
import { getJsDocOfAstNode } from "../getJSDocOfAstNode";
import { getJSDocTagValue } from "./getJSDocTagValue";

const jsDoc = getJsDocOfAstNode(
    createMockSourceFile(tagUnindent`
    /**
     * I am the tag less comment
     * @customTag
     * hello world
     * @description
     * no description
     * @customTag
     * @customTag
     * bye world
    */
    declare type = number;
`).statements[0]
);
if (jsDoc === undefined) throw Error("the test needs to have non undefined jsdoc");
const JSDoc: JSDoc = jsDoc[0];

describe(getJSDocTagValue.name, () => {
    it("returns the value of the specified jsDoc tag", () => {
        expect(getJSDocTagValue(JSDoc, "customTag")).toEqual(["hello world", null, "bye world"]);
    });
    it("throws when the provided ast node does not have the specified jsDoc tag", () => {
        const tagName = "myCustomTag";
        expect(getJSDocTagValue(JSDoc, tagName)).toEqual([]);
    });
});
