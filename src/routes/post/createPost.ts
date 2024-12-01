import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import {createPost} from "@database/repo/PostRepository";
import {z} from "zod";
import STRING from "@database/DataSchema/STRING";

const PostCreationDataParser = z.object({
	title: STRING,
	body: STRING,
})

export default function _createPost(req: Request, res: Response) {
	const parsed = PostCreationDataParser.safeParse(req.body);
	const userID: number = parseInt(req.headers.userID!.toString(), 10);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const rawPost = parsed.data;

	createPost(rawPost, userID)
		.then(createdPost => {
			log.info(createdPost);
			return ResponseBuilder.Ok(res, createdPost);
		})
		.catch(err => {
			log.warn(err);
			return ResponseBuilder.InternalServerError(res);
		})
}
