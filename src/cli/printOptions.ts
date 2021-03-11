import { optionTypeAsStringUnion, optionTypeUnion, parsedOption } from "../types";
import { tagUnindent } from "../utils";

export function printOptions(_: { options: parsedOption[]; required: boolean }): string {
    const { options, required } = _;
    // prettier-ignore
    const N = ({ optionName, flag }: { optionName: string; flag?: string }) => `${flag !== undefined ? "-" + flag : "  "} --${optionName} `;
    // prettier-ignore
    const n = Math.max(...options.map((_) => N(_).length));
    // prettier-ignore
    const T = ({ type }: { type: optionTypeAsStringUnion }) => `: ${type}`;
    // prettier-ignore
    const t = Math.max(...options.map((_) => T(_).length));
    // prettier-ignore
    const I = ({defaultValue} : {defaultValue? : optionTypeUnion}) => `${defaultValue !== undefined ? ` = ${JSON.stringify(defaultValue)}` : ""}`;
    // prettier-ignore
    const i = Math.max(...options.map((_) => I(_).length));
    return tagUnindent`
        ${required ? "Required" : "Non required"} options:

          ${[
              options
                  .map((_) => N(_).padEnd(n, " ") + T(_).padEnd(t, " ") + I(_).padEnd(i, " ") + `  ${_.description}`)
                  .join("\n"),
          ]}
    `;
}