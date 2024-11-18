import {Request, Response} from "express";
import {AppDataSourceOptions} from "@database/DataSource";
import env from "@root/env";
import ResponseBuilder from "@services/responseBuilder";
import {createDatabase, dropDatabase} from "typeorm-extension";
import log from "@services/logger";
import MessageCodes from "@root/messageCodes";

export default async function purgeDB(req: Request, res: Response) {
	try {
		await dropDatabase({ifExist: true, options: AppDataSourceOptions, initialDatabase: "postgres"});
		await createDatabase({ifNotExist: true, options: AppDataSourceOptions, initialDatabase: "postgres"});
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res, MessageCodes.DATABASE_BUSY);
	}


	ResponseBuilder.Ok(res);
}