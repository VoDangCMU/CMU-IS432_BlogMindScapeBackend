import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "@models/User";


@Entity()
export class UserSession {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, {onDelete: "CASCADE"})
	user: User;

	@Column()
	expiredOn: Date;
}