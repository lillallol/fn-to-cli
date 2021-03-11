import { JSDoc, unescapeLeadingUnderscores } from "typescript";

/**
 * @description
 * It returns the values that all JSDoc tags of the provided name, have in the provide ast node.
 */
export function getJSDocTagValue(JSDoc: JSDoc, jsDocTagName: string): (null | string)[] {
    const { tags } = JSDoc;
    if (tags === undefined) return [];
    return Array.from(tags)
        .filter(({ tagName }) => unescapeLeadingUnderscores(tagName.escapedText) === jsDocTagName)
        .map(({ comment }) => comment ?? null);
}
