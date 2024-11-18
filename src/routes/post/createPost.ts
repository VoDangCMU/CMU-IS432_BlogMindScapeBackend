import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import {createPost, POST_CREATE_SCHEMA, POST_SCHEMA, PostCreateSchema,} from "@database/repo/PostRepository";

export default function _createPost(req: Request, res: Response) {
	const parsed = POST_CREATE_SCHEMA.safeParse(req.body);
	const userID: number = parseInt(req.headers["userID"] as string, 10);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const reqBody: PostCreateSchema = parsed.data;

	createPost(reqBody, userID)
		.then(createdPost => {
			log.info(createdPost);
			return ResponseBuilder.Ok(res, POST_SCHEMA.parse(createdPost));
		})
		.catch(err => {
			log.warn(err);
			return ResponseBuilder.InternalServerError(res);
		})
}
