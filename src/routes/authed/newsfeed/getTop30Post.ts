import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";

export default async function getTop30Post(req: Request, res: Response) {
    const posts = await PostRepository.find({
        order: {upvote: "DESC"},
        take: 30,
        relations: {user: true}
    })
    log.info(posts);
    return ResponseBuilder.Ok(res, posts);
}