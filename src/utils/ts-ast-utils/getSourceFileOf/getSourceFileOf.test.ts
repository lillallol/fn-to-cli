import { getSourceFileOf } from "./getSourceFileOf";

import * as path from "path";
import * as fs from "fs";

describe(getSourceFileOf.name, () => {
    it("creates an abstract syntax tree of the file that corresponds to the provided path", () => {
        const absolutePathToFile: string = path.resolve(__dirname, "file.mock.ts");
        const fileSrc = fs.readFileSync(absolutePathToFile, { encoding: "utf-8" });
        const { text } = getSourceFileOf(absolutePathToFile);
        expect(text).toBe(fileSrc);
    });
});
