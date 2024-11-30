import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import {NUMBER} from "@database/repo/CommonSchemas";

export default async function getAllPostsByPage(req: Request, res: Response) {
    const parsedPage = NUMBER.optional().safeParse(req.params.page);
    const pageSize: number = 30;

    if (parsedPage.error) {
        log.warn(parsedPage.error);
        return ResponseBuilder.BadRequest(res, parsedPage.error);
    }

    const page = parsedPage.data === undefined ? 0 : parsedPage.data - 1;

    try {
        const postInPage = await PostRepository.find({
            order:{createdAt : "DESC"},
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