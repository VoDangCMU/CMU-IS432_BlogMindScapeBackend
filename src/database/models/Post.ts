import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import User from "./User";
import Comment from "./Comment";

export const PostTableName = "post";

@Entity({name: PostTableName})
export default class Post {
	@PrimaryGeneratedColumn({type: "bigint"})
	id: number;

	@ManyToOne(() => User, {onDelete: "CASCADE"})
	user: User;

	@Column()
	title: string;

	@Column()
	body: string;

	@Column({default: 0})
	upvote: number;

	@Column({default: 0})
	downvote: number;

	@OneToMany(() => Comment, (comment) => comment.post, {onDelete: "CASCADE"})
	comments: Array<Comment>;

	@CreateDateColumn()
	public createdAt: Date;
}
