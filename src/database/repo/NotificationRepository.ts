import {AppDataSource} from "../DataSource";
import Notification from "../models/Notification";
import User from "@models/User";

export type NotificationInteraction = "upvote" | "downvote" | "comment";

const NotificationRepository = AppDataSource.getRepository(Notification);

export async function createNotification(interaction: NotificationInteraction, target: User, interactor: User) {
	const notif = new Notification();

	notif.interaction = interaction;
	notif.target = target;
	notif.interactor = interactor;

	await NotificationRepository.save(notif);

	return notif;
}

export default NotificationRepository;