import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";

export default async function getAllPosts(req: Request, res: Response) {
    try {
        const posts = await PostRepository.find({});
        log.info(posts);
        return ResponseBuilder.Ok(res, posts);
    }catch (e) {
        log.error(e);
        return ResponseBuilder.InternalServerError(res, e);
    }

}