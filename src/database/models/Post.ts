import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm"
import User from "./User";

@Entity()
export default class Post {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE"})
    user: User

    @Column()
    title: string

    @Column()
    body: string 

    @Column({ default: 0 })
    upvote: number

    @Column({ default: 0 })
    downvote: number

    @ManyToMany(() => User, (user) => user.upvotedPosts, { onDelete: "CASCADE"})
    upvotedUsers: Array<User>
}

module.exports = Post;