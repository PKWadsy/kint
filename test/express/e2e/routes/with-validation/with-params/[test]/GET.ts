import { duvet } from "../../../../duvet";
import { zodValidator } from "src/zod/zodValidator";
import { z } from "zod";

export default duvet.defineEndpoint(
  {},
  zodValidator({ params: z.object({ test: z.coerce.number() }) }),
  (request, k) => {
    // Returns the value of the "test" query parameter.
    return { data: k.valid.params.test.toString(), status: 200 };
  },
);
