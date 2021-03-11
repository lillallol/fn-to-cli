import { JSDoc, unescapeLeadingUnderscores } from "typescript";

/**
 * @description
 * Returns a predicate on whether the provided ast node has jsDoc tag
 * of the provided name.
 * If there is no JSDoc comment then it returns `false`.
 */
export function hasJSDocTagOfName(JSDoc: JSDoc, tagName: string): boolean {
    const { tags } = JSDoc;
    if (tags === undefined) return false;
    return tags.some(({ tagName: _tagName }) => unescapeLeadingUnderscores(_tagName.escapedText) === tagName);
}
