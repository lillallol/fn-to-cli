import { isFunctionDeclaration } from "typescript";
import { createMockSourceFile } from "../../test-utils";
import { tagUnindent } from "../../utils/index";
import { throwIfParameterIsNotObjectLiteral, _errorMessages } from "./throwIfParameterIsNotObjectLiteral";

describe(throwIfParameterIsNotObjectLiteral.name, () => {
    it("throws error when the function first parameter is not of object literal type", () => {
        const s = createMockSourceFile(tagUnindent`
            function fn(a : number) {}
        `).statements[0];
        if (!isFunctionDeclaration(s)) throw Error();

        expect(() => throwIfParameterIsNotObjectLiteral(s)).toThrow(
            _errorMessages.invalidTypeParameterForFunctionConvertToCLI
        );
    });
    it("does not throw error when the function first parameter is object literal type", () => {
        const s = createMockSourceFile(tagUnindent`
            function fn(a : {b : number}) {}
        `).statements[0];
        if (!isFunctionDeclaration(s)) throw Error();

        expect(() => throwIfParameterIsNotObjectLiteral(s)).not.toThrow();
    });
});
