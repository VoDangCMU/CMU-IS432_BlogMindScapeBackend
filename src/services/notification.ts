import User from '@models/User';
import Notification from '@models/Notification';
import { AppDataSource } from '@database/DataSource';

export type INotificationInteraction = 'upvote' | 'downvote' | 'comment';

const NotificationRepository = AppDataSource.getRepository(Notification);

export async function createNotification(
	interaction: INotificationInteraction,
	target: User,
	interactor: User,
) {
	const notif = new Notification();

	notif.interaction = interaction;
	notif.target = target;
	notif.interactor = interactor;

	await NotificationRepository.save(notif);

	return notif;
}
