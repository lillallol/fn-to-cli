import { JSDoc } from "typescript";
import { internalLibraryErrorMessage } from "../es-utils/internalLibraryErrorMessage";

/**
 * @description
 * It returns the values that all JSDoc tags of the provided name, have in the provide ast node.
 * It checks only the last JSDoc comment.
 *
 * It returns `null` if the provided ast node
 *
 * - does not have the provided JSDoc tag.
 * - does not have jsDoc comment
 *
 * It returns the tag less comment for provided JSDoc tag name being `null`.
 */
export function getJSDocTagLessValue(JSDoc: JSDoc): null | string {
    const { comment } = JSDoc;
    if (comment === undefined) return null;
    if (typeof comment === "string") return comment;
    throw Error(internalLibraryErrorMessage);
}
