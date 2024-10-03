import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import User from "./User";
import Comment from "./Comment";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user: User;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: 0 })
  upvote: number;

  @Column({ default: 0 })
  downvote: number;

  @ManyToMany(() => User, (user) => user.upvotedPosts, { onDelete: "CASCADE" })
  upvotedUsers: Array<User>;

  @ManyToMany(() => User, (user) => user.downvotedPosts, {
    onDelete: "CASCADE",
  })
  downvotedUsers: Array<User>;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: "CASCADE" })
  comments: Array<Comment>;
}

module.exports = Post;
