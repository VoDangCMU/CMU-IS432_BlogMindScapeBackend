import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import Post from "@models/Post";
import User from "@models/User";

@Entity()
export default class Comment {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column()
  body: string;

  @Column({ nullable: true })
  attachment: string;

  @CreateDateColumn()
  issueAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  post: Post;
}
