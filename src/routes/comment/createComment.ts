import {Request, Response} from "express";
import {AppDataSource} from "@database/DataSource";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import Post from "@models/Post";
import User from "@models/User";
import Comment from "@models/Comment";
import NUMBER from "@database/DataSchema/NUMBER";
import {z} from "zod";
import STRING from "@database/DataSchema/STRING";
import UserRepository from "@database/repo/UserRepository";
import PostRepository from "@database/repo/PostRepository";
import CommentRepository from "@database/repo/CommentRepository";

const CommentCreationDataParser = z.object({
	body: STRING,
	attachment: STRING,
	postID: NUMBER
})

export default async function createComment(req: Request, res: Response) {
	let reqBody, userID;

	try {
		reqBody = CommentCreationDataParser.parse(req.body);
		userID = NUMBER.parse(req.headers["userID"]);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		const user = await UserRepository.findOne({where: {id: userID}});
		const post = await PostRepository.findOne({
			where: {id: reqBody.postID},
		});

		if (!user) return ResponseBuilder.NotFound(res, "USER_NOT_FOUND");
		if (!post) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");

		let createdComment = new Comment();

		if (reqBody.attachment) createdComment.attachment = reqBody.attachment;
		createdComment.body = reqBody.body;
		createdComment.user = user;
		createdComment.post = post;

		await CommentRepository.save(createdComment);

		log.info(createdComment);

		return ResponseBuilder.Ok(
			res,
			createdComment
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
