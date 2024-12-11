import {
	Check,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

export const NotificationTableName = 'notification';

@Entity({ name: NotificationTableName })
export default class Notification {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@Column({ default: false })
	read: boolean;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	target: User;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	interactor: User;

	@Column()
	@Check(
		`"interaction" = 'upvote' or "interaction" = 'downvote' or "interaction" = 'comment'`,
	)
	interaction: string;
}
