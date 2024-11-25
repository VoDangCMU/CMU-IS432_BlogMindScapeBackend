import {AppDataSource} from "@database/DataSource";
import Post from "@database/models/Post";
import {NUMBER, STRING} from "@database/repo/CommonSchemas";
import {z} from "zod";
import UserRepository, {USER_SCHEMA} from "./UserRepository";
import MessageCodes from "@root/messageCodes";

const PostRepository = AppDataSource.getRepository(Post);

export const BASE_POST = z.object({
	id: NUMBER.optional(),
	title: STRING,
	body: STRING,
	upvote: NUMBER,
	downvote: NUMBER,
	user: USER_SCHEMA
});

export const POST_CREATE_SCHEMA = z.object({
	title: STRING,
	body: STRING,
});

export const POST_SCHEMA = BASE_POST;
export const POSTS_SCHEMA = z.array(BASE_POST);
export const POST_UPDATE_SCHEMA = z.object({
	id: NUMBER,
	title: STRING.optional(),
	body: STRING.optional(),
});

export declare type BasePost = z.TypeOf<typeof BASE_POST>;
export declare type PostCreateSchema = z.TypeOf<typeof POST_CREATE_SCHEMA>;

export async function createPost(
	params: PostCreateSchema,
	authorID: number | string
) {
	const _authorID = NUMBER.parse(authorID);
	const author = await UserRepository.findOne({where: {id: _authorID}});

	if (!author) throw new Error(MessageCodes.USER_NOT_EXISTED);

	let createdPost = new Post();

	createdPost.title = params.title;
	createdPost.body = params.body;
	createdPost.user = author;

	await PostRepository.save(createdPost);

	return POST_SCHEMA.parse(createdPost);
}

export default PostRepository;
