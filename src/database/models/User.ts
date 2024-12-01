import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm"

export const UserTableName = "user";

@Entity({name: UserTableName})
@Unique('UNIQUE_USERNAME', ['username'])
@Unique('UNIQUE_MAIL', ['mail'])
export default class User {
	@PrimaryGeneratedColumn({type: "bigint"})
	id: number

	@Column()
	username: string

	@Column()
	mail: string

	@Column()
	fullname: string

	@Column()
	dateOfBirth: Date

	@Column({select: false})
	password: string
}