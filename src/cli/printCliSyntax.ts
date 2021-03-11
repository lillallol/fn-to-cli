import { tagUnindent } from "../utils";

export function printCliSyntax(_ : {
    packageName : string,
    commandName : string,
    isSingleOptionalCommandCli : boolean,
    commandHasRequiredOptions : boolean,
}):string {
    const {commandHasRequiredOptions,isSingleOptionalCommandCli,packageName,commandName} = _;
    return tagUnindent`
        CLI syntax:

          ${packageName} ${commandName}${isSingleOptionalCommandCli ? "?" : ""} [[--<option> | -<flag>] <value>]${commandHasRequiredOptions ? "+" : "#"}

    `
}