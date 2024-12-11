import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import Post from './Post';

export const UpvoteTableName = 'upvote';

@Entity({ name: UpvoteTableName })
export default class Upvote {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Post, { onDelete: 'CASCADE' })
	post: Post;

	@CreateDateColumn()
	createdAt: Date;
}
