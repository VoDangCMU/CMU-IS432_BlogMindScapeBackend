import {AppDataSource} from "@database/DataSource";
import Upvote from "@models/Upvote";
import User from "@models/User";
import Post from "@models/Post";

const UpvoteRepository = AppDataSource.getRepository(Upvote);

export async function createUpvote(user: User, post: Post) {
	const upvote = new Upvote();

	upvote.user = user;
	upvote.post = post;

	await UpvoteRepository.save(upvote);

	return upvote;
}

export default UpvoteRepository;