import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "@models/User";
import Post from "@models/Post";

@Entity()
export default class Upvote {
	@PrimaryGeneratedColumn({type: "bigint"})
	id: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Post, { onDelete: 'CASCADE' })
	post: Post;
}