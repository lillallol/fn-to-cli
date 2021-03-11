import { tagUnindent } from "./tagUnindent";

export const internalLibraryErrorMessage = tagUnindent`
    Something went wrong. If you have not used the library in a way
    it is not supposed to be used, then copy the call stack and open
    an issue here:

        https://github.com/lillallol/fn-to-cli/issues
    
`;
