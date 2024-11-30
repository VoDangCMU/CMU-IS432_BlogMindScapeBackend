import {Request, Response} from "express";
import {NUMBER} from "@database/repo/CommonSchemas";
import ResponseBuilder from "@services/responseBuilder";
import UpvoteRepository from "@database/repo/UpvoteRepository";
import log from "@services/logger";
import DownvoteRepository from "@database/repo/DownvoteRepository";
import PostRepository from "@database/repo/PostRepository";

export async function isUpvoted(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

		const postID = parsed.data;

		UpvoteRepository.findOne({
			where: {
				post: {id: postID},
				user: {id: userID}
			}
		})
			.then((existedUpvote) => {
				if (!existedUpvote)
					return ResponseBuilder.Ok(res, {isUpvoted: false})
				return ResponseBuilder.Ok(res, {isUpvoted: true})
			})
			.catch(err => {
				log.error(err);
				return ResponseBuilder.InternalServerError(res);
			})
}

export async function isDownvoted(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const postID = parsed.data;

	DownvoteRepository.findOne({
		where: {
			post: {id: postID},
			user: {id: userID}
		}
	})
		.then((existedDownvote) => {
			if (!existedDownvote)
				return ResponseBuilder.Ok(res, {isDownvoted: false})
			return ResponseBuilder.Ok(res, {isDownvoted: true})
		})
		.catch(err => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}

export async function getVoteStatus(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const postID = parsed.data;

	try {
		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				post: {id: postID},
				user: {id: userID}
			}
		})

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				post: {id: postID},
				user: {id: userID}
			}
		})

		log.info(existedDownvote, existedUpvote);

		return ResponseBuilder.Ok(res, {
			isDownvoted: existedDownvote !== null,
			isUpvoted: existedUpvote !== null
		})
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res);
	}
}