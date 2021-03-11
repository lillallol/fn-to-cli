export type parsedCommandForFnToCli = {
    description: string;
    /**
     * @description
     * It has value named if the command is a named export, or default if the
     * value is a default export.
     */
    exportValue: "named" | "default";
    commandName: string;
    /**
     * @description
     * Absolute path to the file that has the command function.
     */
    absolutePathToFile: string;
    options: parsedOption[];
}

export type parsedCommandForCli = {
    description: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    command: Function;
    options: parsedOption[];
}

export type parsedOption = {
    defaultValue?: optionTypeUnion;
    description: string;
    optionName: string;
    isOptional: boolean;
    flag?: string;
    type: optionTypeAsStringUnion;
};

export type optionTypeUnion = string | number | boolean | string[] | number[] | boolean[];
export type optionTypeAsStringUnion = "string" | "number" | "boolean" | "string[]" | "number[]" | "boolean[]";
export const arrayFromOptionTypesAsStrings = ["string", "number", "boolean", "string[]", "number[]", "boolean[]"];
