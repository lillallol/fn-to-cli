import { tagUnindent } from "../utils";

export type IPrintCliCommandsDocumentation = (_: {
    packageName: string;
    commandNames: string[];
}) => string;

export const printCliCommandsDocumentation: IPrintCliCommandsDocumentation = function printCliCommandsDocumentation(_) {
    const { packageName, commandNames } = _;
    return tagUnindent`
        Commands:

          ${[commandNames.join("\n")]}

        Use:

          ${packageName} <command> [--help|-h]

        for further information regarding each command.

        Use:

          ${packageName} <command> [--<option>|-<flag>]+ [--help|-h]

        for information regarding specific options of a command.

        Use:

          ${packageName} [--version|-v]

        to get the version of the current CLI executable.
    `;
};
