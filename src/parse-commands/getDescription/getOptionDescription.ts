import { JSDoc } from "typescript";
import { _getDescription } from "./getDescription";

/**
 * @description
 * It also validates that the description is well defined.
 */
export function getOptionDescription(_: {
    commandName: string;
    JSDoc: JSDoc;
    absolutePathToInput: string;
    optionName: string;
}): string {
    const { absolutePathToInput, JSDoc, commandName, optionName } = _;
    return _getDescription({
        commandName,
        optionName,
        JSDoc,
        absolutePathToInput,
    });
}
