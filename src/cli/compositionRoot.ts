import { cliFactory, ICli } from "./cli";
import { printCliCommandsDocumentation } from "./printCliCommandsDocumentation";
import { printCliOptionsDocumentation } from "./printCliOptionsDocumentation";

export const cli: ICli = cliFactory(printCliCommandsDocumentation, printCliOptionsDocumentation);
