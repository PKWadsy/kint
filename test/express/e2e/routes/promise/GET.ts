import { ExpressResponseWrapper } from "src/express/models/ExpressResponseWrapper";
import { duvet } from "../../duvet";

export default duvet.defineEndpoint({}, async () => {
  const promise = new Promise<ExpressResponseWrapper>((resolve) => {
    setTimeout(() => {
      resolve({ data: "Success", status: 200 });
    }, 10);
  });
  return promise;
});
