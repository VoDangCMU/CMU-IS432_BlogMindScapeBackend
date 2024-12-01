import {AppDataSource} from "@database/DataSource";
import Comment from "@models/Comment";

const CommentRepository = AppDataSource.getRepository(Comment);

export default CommentRepository;