import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Post from "./Post";

export const DownvoteTableName = "downvote";

@Entity({name: DownvoteTableName})
export default class Downvote {
	@PrimaryGeneratedColumn({type: "bigint"})
	id: number;

	@ManyToOne(() => User, {onDelete: 'CASCADE'})
	user: User;

	@ManyToOne(() => Post, {onDelete: 'CASCADE'})
	post: Post;
}