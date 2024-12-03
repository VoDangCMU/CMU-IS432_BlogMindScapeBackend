import {Request, Response} from 'express'
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import DownvoteRepository from "@database/repo/DownvoteRepository";

export default async function getUserDownvotes(req: Request, res: Response) {
    const userID = parseInt(req.headers.userID!.toString());

    try {
        const userDownvotes = await DownvoteRepository.find({
            where: {user: {id: Number(userID)}},
            relations: {post: true}
        })
        return ResponseBuilder.Ok(res, userDownvotes);
    } catch (e) {
        log.error(e);
        return ResponseBuilder.InternalServerError(res);
    }
}