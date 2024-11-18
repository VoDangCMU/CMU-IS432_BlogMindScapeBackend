import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";

export default async function getTop30Post(req: Request, res: Response) {
    try {
        const top30 = await PostRepository.find({
            order: {upvote: "DESC"},
            take: 30,
            relations: {user: true}
        })

        log.info(top30);

        return ResponseBuilder.Ok(res, top30);
    } catch (error) {
        log.error(error);
        return ResponseBuilder.InternalServerError(res);
    }
}