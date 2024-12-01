import {AppDataSource} from "@database/DataSource";
import Post from "@database/models/Post";
import UserRepository from "./UserRepository";
import MessageCodes from "@root/messageCodes";
import NUMBER from "@database/DataSchema/NUMBER";

const PostRepository = AppDataSource.getRepository(Post);

export async function createPost(
	params: any,
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

	return createdPost;
}

export default PostRepository;
