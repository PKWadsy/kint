import { ZodTypeAny } from "zod";
import { RequestFields } from "./RequestFields";

export type GenericZodSchemaMap = {
  [Key in RequestFields]?: ZodTypeAny;
};
