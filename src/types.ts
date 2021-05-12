export type parsedCommandForFnToCli = {
    /**
     * @description
     * This is only needed for printing the command documentation.
     */
    description: string;
    /**
     * @description
     * It has value named if the command is a named export, or default if the
     * value is a default export.
     */
    exportValue: "named" | "default";
    /**
     * @description
     * This is the `@CLI` value, or if it has no value, it is the function name.
     */
    commandName: string;
    /**
     * @description
     * This the function name. This is used to import the command into the bin file.
     */
    functionName: string;
    /**
     * @description
     * Absolute path to the file that has the command function.
     */
    absolutePathToFile: string;
    options: parsedOption[];
};

export type parsedCommandForCli = {
    /**
     * @description
     * This is only needed for printing the command documentation.
     */
    description: string;
    commandName: string;
    options: parsedOption[];
    command: Function;
};

export type parsedOption = {
    /**
     * @description
     * This is only needed for printing the command documentation.
     */
    defaultValue?: string;
    /**
     * @description
     * This is only needed for printing the command documentation.
     */
    description: string;
    optionName: string;
    isOptional: boolean;
    flag?: string;
    /**
     * @description
     * This is only needed for printing the command documentation.
     */
    type: string;
};
