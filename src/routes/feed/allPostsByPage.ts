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

    const totalPage = Math.ceil((await PostRepository.count()) / pageSize);
    const page = parsedPage.data === undefined ? 0 : parsedPage.data - 1;

    if (page >= totalPage) {
        log.warn(`Page ${page + 1} exceeds total pages ${totalPage}`);
        return ResponseBuilder.BadRequest(res, `Page ${page + 1} exceeds total pages ${totalPage}`);
    }
    try {
        const postInPage = await PostRepository.find({
            order: {createdAt: "DESC"},
            skip: page * pageSize,
            take: pageSize,
            relations: {user: true}
        });
        log.info(postInPage);
        return ResponseBuilder.Ok(res, {
            currentPage: page + 1,
            totalPage: totalPage,
            postInPage: postInPage
        });
    } catch (error) {
        log.error(error);
        return ResponseBuilder.InternalServerError(res);
    }
}