import { errorMessages } from "../errorMessages";
import { parsedOption } from "../types";
import { createOptionNamesSet } from "./createOptionNamesSet";

type options = Pick<parsedOption, "flag" | "isOptional" | "optionName">[];

export class optionNamesCountMap {
    private optionNameToCount: Map<string, number>;
    private optionNames: Set<string>;
    private optionNameToFlagNameHash: { [optionName: string]: string };
    private commandName: string;
    private options: options;

    constructor(_: {
        options: options;
        optionNameToFlagNameHash: { [optionName: string]: string };
        commandName: string;
    }) {
        const { optionNameToFlagNameHash, commandName, options } = _;

        this.options = options;
        this.optionNameToCount = new Map();
        this.optionNames = createOptionNamesSet(options);
        this.optionNameToFlagNameHash = optionNameToFlagNameHash;
        this.commandName = commandName;
    }

    /**
     * @description
     * - It throws error if it is provided with non valid name.
     * - It throws error when the count gets greater than 1.
     */
    public increment(optionName: string): void {
        if (!this.optionNames.has(optionName)) {
            throw Error(errorMessages.invalidOptionName(optionName, this.commandName));
        }
        const currentCount = this.optionNameToCount.get(optionName);
        if (currentCount === undefined) {
            this.optionNameToCount.set(optionName, 1);
            return;
        }
        const flagName: string = this.optionNameToFlagNameHash[optionName];
        throw Error(errorMessages.optionFlagGivenValueMoreThanOnce(optionName, flagName));
    }

    /**
     * @description
     * It throws error when not all non optional parameters got values.
     */
    public throwIfNotAllNonOptionalParameterGotValues(): void {
        const nonOptionalOptionsThatHaveNotBeenGivenValues: string[] = this.options
            .filter(({ optionName, isOptional }) => !isOptional && this.optionNameToCount.get(optionName) !== 1)
            .map(({ optionName }) => optionName);
        if (nonOptionalOptionsThatHaveNotBeenGivenValues.length > 0) {
            throw Error(errorMessages.requiredParametersMissingValues(nonOptionalOptionsThatHaveNotBeenGivenValues));
        }
    }
}
