import { parsedOption } from "../types";
import { tagUnindent } from "../utils";

export function printOptions(_: { options: parsedOption[]; required: boolean }): string {
    const { options, required } = _;
    const optionAndFlagName = ({ optionName, flag }: { optionName: string; flag?: string }) =>
        `${flag !== undefined ? "-" + flag : "  "} --${optionName} `;
    const nameMaxLength = Math.max(...options.map((_) => optionAndFlagName(_).length));
    const type = ({ type }: { type: string }) => `: ${type}`;
    const typeMaxLength = Math.max(...options.map((_) => type(_).length));
    const defaultValue = ({ defaultValue }: { defaultValue?: string }) =>
        `${defaultValue !== undefined ? ` = ${defaultValue}` : ""}`;
    const defaultValueMaxLength = Math.max(...options.map((_) => defaultValue(_).length));

    return tagUnindent`
        ${required ? "Required" : "Non required"} options:

          ${[
              options
                  .map(
                      (_) =>
                          optionAndFlagName(_).padEnd(nameMaxLength, " ") +
                          type(_).padEnd(typeMaxLength, " ") +
                          defaultValue(_).padEnd(defaultValueMaxLength, " ") +
                          `  ${_.description}`
                  )
                  .join("\n"),
          ]}
    `;
}
