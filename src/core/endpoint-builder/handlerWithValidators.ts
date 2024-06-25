import { ConfigurableHandler } from "../common/ConfigurableHandler";
import { ValidatedDataMap } from "../validation/ValidatedDataMap";
import { GenericValidatorMap } from "../validation/GenericValidatorMap";
import { WithValidatedData } from "../validation/WithValid";

/**
 * Takes a handler and wraps it in a new handler which validates the request data.
 * @param innerHandler The handler to wrap.
 * @param validatorMap An array of validators to use to validate the request data.
 * @returns The wrapped handler.
 */
export function wrapHandlerWithValidationLayer<
  RequestType,
  ResponseType,
  Context,
  Config,
  Validators extends GenericValidatorMap<RequestType>,
>(
  innerHandler: ConfigurableHandler<
    RequestType,
    ResponseType,
    WithValidatedData<Context, RequestType, Validators>,
    Config
  >,
  validatorMap: Validators,
): ConfigurableHandler<RequestType, ResponseType, Context, Config> {
  const handler: ConfigurableHandler<
    RequestType,
    ResponseType,
    Context,
    Config
  > = (request, context, config) => {
    const validatedData: ValidatedDataMap<RequestType, Validators> =
      {} as ValidatedDataMap<RequestType, Validators>;

    for (const validatorKey in validatorMap) {
      const validator = validatorMap[validatorKey];
      const result = validator(request);

      if (result.isValid) {
        validatedData[validatorKey] = result.parsedData;
      } else {
        throw new DuvetValidationError(result.error);
      }
    }

    (context as WithValidatedData<Context, RequestType, Validators>).valid =
      validatedData;

    return innerHandler(
      request,
      context as WithValidatedData<Context, RequestType, Validators>,
      config,
    );
  };

  return handler;
}

export class DuvetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuvetValidationError";
  }
}
