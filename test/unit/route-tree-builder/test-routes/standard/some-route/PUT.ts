import { KintResponse } from "../../../../../../src";
import { kint } from "../../../kint";

export default kint.defineZodEndpoint({}, (request, response, context) => {
  return new KintResponse("Does nothing", 200);
});