import { isPropertySignature, TypeLiteralNode } from "typescript";
import { parsedOption } from "../types";
import { errorMessages } from "../errorMessages";
import { getDefaultJSDocTagValueOfOption } from "./getDefaultJSDocTagValueOfOption";
import { getOptionDescription } from "./getDescription/getOptionDescription";
import { getFlagJSDocTagValue } from "./getFlagJSDocTagValue";
import { getOptionJSDocCommentStrict } from "./getJSDocCommentStrict";
import { getOptionName } from "./getOptionName";
import { getOptionType } from "./getOptionType";
import { hasPrivateJSDocTagValue } from "./hasPrivateJSDocTagValue";
import { isOptionalMember } from "./isOptionalMember";

export function parseOptions(_: {
    parameter: TypeLiteralNode;
    absolutePathToInput: string;
    commandName: string;
}): parsedOption[] {
    const { absolutePathToInput, parameter, commandName } = _;
    const toReturn: parsedOption[] = [];

    Array.from(parameter.members).forEach((option) => {
        const optionName = getOptionName({ option, commandName });
        if (!isPropertySignature(option)) {
            throw Error(errorMessages.memberIsNotPropertySignature({ optionName, commandName }));
        }
        const JSDoc = getOptionJSDocCommentStrict({
            commandName,
            option,
        });
        const isOptional = isOptionalMember(option);
        const isPrivate = hasPrivateJSDocTagValue(JSDoc, isOptional, commandName, optionName);
        if (isPrivate) return;
        const description = getOptionDescription({ JSDoc, optionName, commandName });
        const type = getOptionType(option, absolutePathToInput, commandName);
        const defaultValue = getDefaultJSDocTagValueOfOption({
            JSDoc,
            optionName,
            commandName,
            isOptional,
        });
        const flag = getFlagJSDocTagValue({
            JSDoc,
            optionName,
            commandName,
            absolutePathToFile: absolutePathToInput,
        });

        toReturn.push({
            optionName: optionName,
            flag,
            defaultValue,
            description,
            isOptional,
            type,
        });
    });

    return toReturn;
}
