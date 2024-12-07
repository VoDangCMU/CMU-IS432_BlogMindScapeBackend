import { Request, Response } from 'express';
import UserRepository from "@database/repo/UserRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";

export default function me(req: Request, res: Response) {
	const userID = parseInt(req.headers.userID!.toString());

	UserRepository.findOne({
		where: {
			id: userID,
		}
	})
		.then((existedUser) => {
			if (!existedUser) {
				// d bh chay vao day duoc luon
				return ResponseBuilder.InternalServerError(res);
			}

			return ResponseBuilder.Ok(res, existedUser);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}
