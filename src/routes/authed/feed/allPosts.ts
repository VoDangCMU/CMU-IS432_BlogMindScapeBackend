import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import {NUMBER} from "@database/repo/CommonSchemas";

export default async function getAllPosts(req: Request, res: Response) {
    const parsedPage = NUMBER.safeParse(req.params.page);
    const pageSize: number = 30;

    if (parsedPage.error) {
        log.warn(parsedPage.error);
        return ResponseBuilder.BadRequest(res, parsedPage.error);
    }

    const page = parsedPage.data;

    try {
        const postInPage = await PostRepository.find({
            order:{id : "DESC"},
            skip: page * pageSize,
            take: pageSize,
            relations:{ user: true }
        });

        log.info(postInPage);
        return ResponseBuilder.Ok(res, postInPage);
    } catch (error) {
        log.error(error);
        return ResponseBuilder.InternalServerError(res);
    }
}