import { Request, Response, Router } from 'express';
import { AppDataSource } from '@database/DataSource';
import Post from '@models/Post';
import log from '@services/logger';
import ResponseBuilder from '@services/responseBuilder';
import NUMBER from '@database/DataSchema/NUMBER';

const PostRepository = AppDataSource.getRepository(Post);

const newsfeed = Router();

newsfeed.get('/top30', getTop30Post);
newsfeed.get('/allPosts/:page', getAllPostsByPage);
newsfeed.get('/allPosts', getAllPosts);

module.exports = newsfeed;

export async function getTop30Post(req: Request, res: Response) {
	try {
		const top30 = await PostRepository.find({
			order: { upvote: 'DESC' },
			take: 30,
			relations: { user: true },
		});

		log.info(top30);

		return ResponseBuilder.Ok(res, top30);
	} catch (error) {
		log.error(error);
		return ResponseBuilder.InternalServerError(res);
	}
}
export async function getAllPosts(req: Request, res: Response) {
	try {
		const posts = await PostRepository.find({});
		log.info(posts);
		return ResponseBuilder.Ok(res, posts);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}
export async function getAllPostsByPage(req: Request, res: Response) {
	const parsedPage = NUMBER.optional().safeParse(req.params.page);
	const pageSize: number = 30;

	if (parsedPage.error) {
		log.warn(parsedPage.error);
		return ResponseBuilder.BadRequest(res, parsedPage.error);
	}

	const totalPage = Math.ceil((await PostRepository.count()) / pageSize);
	const page = parsedPage.data === undefined ? 0 : parsedPage.data - 1;

	if (page >= totalPage) {
		log.warn(`Page ${page + 1} exceeds total pages ${totalPage}`);
		return ResponseBuilder.BadRequest(
			res,
			`Page ${page + 1} exceeds total pages ${totalPage}`,
		);
	}

	try {
		const postInPage = await PostRepository.find({
			order: { createdAt: 'DESC' },
			skip: page * pageSize,
			take: pageSize,
			relations: { user: true },
		});
		log.info(postInPage);
		return ResponseBuilder.Ok(res, {
			currentPage: page + 1,
			totalPage: totalPage,
			postInPage: postInPage,
		});
	} catch (error) {
		log.error(error);
		return ResponseBuilder.InternalServerError(res);
	}
}
