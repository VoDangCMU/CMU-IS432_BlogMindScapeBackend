import {Request, Response} from 'express'
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import DownvoteRepository from "@database/repo/DownvoteRepository";
import Downvote from "@models/Downvote";

export default async function getUserDownvotes(req: Request, res: Response) {
    try {
        const userDownvotes = await DownvoteRepository.find({
            relations: {post: true}
        });

        const result = userDownvotes.reduce((acc: any, curr: Downvote) => {
            return [...acc, curr.post]
        }, []);

        log.info(result);
        return ResponseBuilder.Ok(res, result);
    } catch (e) {
        log.error(e);
        return ResponseBuilder.InternalServerError(res, e);
    }
}