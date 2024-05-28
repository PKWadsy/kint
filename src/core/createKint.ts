import { KintRequest } from '../models/KintRequest';
import { Kint } from '../models/Kint';

export function createKint<Context>(): Kint<Context, {}, [], []> {
	return new Kint<Context, {}, [], []>({}, [], []);
}