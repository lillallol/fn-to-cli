import { tagUnindent } from "../utils";
import { printPackageNameAndVersion } from "./printPackageNameAndVersion";

export type IPrintCliCommandsDocumentation = (_: {
    packageName: string;
    packageVersion: string;
    commandNames: string[];
}) => string;

export const printCliCommandsDocumentation: IPrintCliCommandsDocumentation = function printCliCommandsDocumentation(_) {
    const { packageVersion, packageName, commandNames } = _;
    return tagUnindent`
        ${[
            printPackageNameAndVersion({
                packageVersion,
                packageName,
            }),
        ]}
        Commands:

          ${[commandNames.join("\n")]}

        Use:

          ${packageName} <command> --help

        for further information regarding each command.

        Use:

          ${packageName} <command> [--<option>|-<flag>]+ --help

        for information regarding specific options of a command.
    `;
};
