import User from "@database/models/User";
import {AppDataSource} from "@database/DataSource";
import {hash} from "@services/hasher";

const UserRepository = AppDataSource.getRepository(User);

export async function createUser(params: any) {
	let user = new User();

	user.dateOfBirth = new Date(params.dateOfBirth);
	user.fullname = params.fullname;
	user.mail = params.mail;
	user.username = params.username;
	user.password = hash(params.password);
	user.avatar = params.avatar;

	await UserRepository.save(user);

	const returning = await UserRepository.findOne({
		where: {id: user.id}
	})
	return returning!;
}

export default UserRepository;
