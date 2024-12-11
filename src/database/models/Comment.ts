import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import Post from './Post';
import User from './User';
import { AppDataSource } from '@database/DataSource';

export const CommentTableName = 'comment';

@Entity({ name: CommentTableName })
export class Comment {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@Column()
	body: string;

	@Column({ nullable: true })
	attachment: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Post, { onDelete: 'CASCADE' })
	post: Post;

	@CreateDateColumn()
	createdAt: Date;
}

export default Comment;
