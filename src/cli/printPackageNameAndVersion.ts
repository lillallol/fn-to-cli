import { tagUnindent } from "../utils";

export function printPackageNameAndVersion(_: {
    packageName: string;
    packageVersion: string;
}): string {
    const { packageName, packageVersion} = _;
    // prettier-ignore
    return tagUnindent`
        Package name:

          ${packageName}
        
        Package version:
        
          ${packageVersion}

    `;
}