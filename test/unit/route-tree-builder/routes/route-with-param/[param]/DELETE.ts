import { z } from 'zod';
import { defineExpressEndpoint } from '../../../kint';

export default defineExpressEndpoint(
	{
		urlParams: {
			param: z.string(),
		},
	},
	(request, response, context) => {
		// Stub endpoint.
	}
);
