import { duvet } from "../duvet";
import { zodValidator } from "src/zod/zodValidator";
import { z } from "zod";

export default duvet.defineEndpoint(
  {},
  zodValidator({
    body: z.object({ value: z.string() }),
  }),
  (request, k) => {
    // Returns the value of the "value" body parameter.
    return {
      status: 200,
      data: k.valid.body.value,
      statusMessage: "success",
    };
  },
);
