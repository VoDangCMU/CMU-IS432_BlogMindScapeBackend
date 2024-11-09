import {AppDataSource} from "@database/DataSource";
import {UserSession} from "@models/UserSession";
import User from "@models/User";

const UserSessionRepository = AppDataSource.getRepository(UserSession);

function addDays(date: Date, days: number) {
	const newDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
	return newDate;
}

export async function createSession(user: User) {
	const userSession = new UserSession();

	userSession.user = user;
	userSession.expiredOn = addDays(new Date(), 7);

	await UserSessionRepository.save(userSession);

	return userSession;
}

export default  UserSessionRepository;