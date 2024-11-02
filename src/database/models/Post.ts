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
  OneToMany, CreateDateColumn,
} from "typeorm";
import User from "@models/User";
import Comment from "@models/Comment";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: 0 })
  upvote: number;

  @Column({ default: 0 })
  downvote: number;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: "CASCADE" })
  comments: Array<Comment>;

  @CreateDateColumn()
  createdAt: Date;
}
