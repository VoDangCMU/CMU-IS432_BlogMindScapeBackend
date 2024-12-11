import {Request, Response} from 'express'
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import UpvoteRepository from "@database/repo/UpvoteRepository";
import Upvote from "@models/Upvote";

export default async function getUserUpvotes(req: Request, res: Response) {

    try {
        const userUpVotes = await UpvoteRepository.find({
            relations: {post: true},
            order: {createdAt: "DESC"}
        })

        const result = userUpVotes.reduce((acc: any, curr: Upvote) => {
            return [...acc, curr.post];
        }, []);

        log.info(result);
        return ResponseBuilder.Ok(res, result);
    } catch (e) {
        log.error(e);
        return ResponseBuilder.InternalServerError(res);
    }
}