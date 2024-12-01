import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";

export const UserSessionTableName = "user_session";

@Entity({name: UserSessionTableName})
export class UserSession {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, {onDelete: "CASCADE"})
	user: User;

	@Column()
	expiredOn: Date;
}