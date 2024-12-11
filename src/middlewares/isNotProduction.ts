import { NextFunction, Request, Response } from 'express';
import env from '@root/env';
import ResponseBuilder from '@services/responseBuilder';

export default function isNotProduction(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (env.ENV !== 'production') return next();

	return ResponseBuilder.Forbidden(res);
}
