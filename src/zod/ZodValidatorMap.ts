import { ZodTypeAny, output } from "zod";
import { Validator } from "../core/validation/Validator";
import { RequestFields } from "./models/RequestFields";
import { ZodCompatibleRequest } from "./models/ZodCompatibleRequest";
import { GenericZodSchemaMap } from "./models/GenericZodSchemaMap";

export type ZodValidatorMap<ZodSchemaMap extends GenericZodSchemaMap> = {
  [K in RequestFields as ZodSchemaMap[K] extends ZodTypeAny
    ? K
    : never]-?: ZodSchemaMap[K] extends ZodTypeAny
    ? Validator<ZodCompatibleRequest, output<ZodSchemaMap[K]>>
    : never;
};
