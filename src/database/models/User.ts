import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, JoinColumn, ManyToMany, JoinTable } from "typeorm"
import Post from "@models/Post"

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

    @Column({select: false})
    password: string
}