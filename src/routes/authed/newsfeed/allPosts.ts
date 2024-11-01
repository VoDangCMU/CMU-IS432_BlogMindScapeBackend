import {Request, Response} from "express";
import PostRepository from "@database/repo/PostRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";

export default async function getAllPosts(req: Request, res: Response) {
    let page : number = 0;
    const pageSize: number = 30;
    let allEntities = [];
    while(true){
        const allPosts= await PostRepository.find({
            order:{id : "DESC"},
            skip: page * pageSize,
            take: pageSize,
            relations:{ user: true }
        });
        allEntities.push(...allPosts);
        if(allPosts.length < pageSize )
            break;
        page++;
    }

    log.info(allEntities);
    return ResponseBuilder.Ok(res, allEntities);
}