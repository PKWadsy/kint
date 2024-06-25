import { createExpressDuvet } from "src/express/createExpressDuvet";
import { Context } from "./Context";

export const { build, duvet } = createExpressDuvet<Context>();
