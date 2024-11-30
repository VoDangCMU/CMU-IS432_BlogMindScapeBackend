import {AppDataSource} from "@database/DataSource";
import Upvote from "@models/Upvote";
import User from "@models/User";
import Post from "@models/Post";
import Downvote from "@models/Downvote";

const DownvoteRepository = AppDataSource.getRepository(Downvote);

export async function createDownvote(user: User, post: Post) {
	const downvote = new Downvote();

	downvote.user = user;
	downvote.post = post;

	await DownvoteRepository.save(downvote);

	return downvote;
}

export default DownvoteRepository;