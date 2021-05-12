import { parsedOption } from "../types";

export function createOptionNamesSet(options: Pick<parsedOption,"optionName">[]): Set<string> {
    return new Set(options.map(({ optionName }) => optionName));
}
