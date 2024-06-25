import { Validator } from "./Validator";

export type ExtractData<V> = V extends Validator<never, infer Data> ? Data : V;
