import {Request, Response} from 'express'
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import UpvoteRepository from "@database/repo/UpvoteRepository";

export default async function getUserUpvotes(req: Request, res: Response) {
    const userID = parseInt(req.headers.userID!.toString());

    try {
        const userUpVotes = await UpvoteRepository.find({
            where: {user: {id: Number(userID)}},
            relations: {post: true}
        })
        return ResponseBuilder.Ok(res, userUpVotes);
    } catch (e) {
        log.error(e);
        return ResponseBuilder.InternalServerError(res);
    }
}