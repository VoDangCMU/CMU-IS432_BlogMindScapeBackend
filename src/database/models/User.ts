import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from "typeorm"

@Entity()
@Unique('UNIQUE_USERNAME', ['username'])
@Unique('UNIQUE_MAIL', ['mail'])
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    mail: string

    @Column()
    fullname: string

    @Column()
    dateOfBirth: Date

    @Column()
    password: string
}

module.exports = User;