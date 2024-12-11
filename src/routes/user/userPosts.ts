import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";

export default function userPosts(req: Request, res: Response) {
	log.info(req.headers.userID)
	const userID = parseInt(req.headers.userID!.toString(), 10);

	PostRepository.find({
		where: {
			user: {id: userID}
		},
		relations: {
			user: true
		}
	})
		.then((posts) => {
			return ResponseBuilder.Ok(res, posts);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}