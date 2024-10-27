import {Request, Response} from "express";
import {AppDataSource, AppDataSourceOptions} from "@database/DataSource";
import env from "@root/env";
import ResponseBuilder from "@services/responseBuilder";
import {createDatabase, dropDatabase} from "typeorm-extension";
import log from "@services/logger";

export default async function purgeDB(req: Request, res: Response) {
	if (env.ENV !== 'testing')
		return ResponseBuilder.Forbidden(res);

	// log.info(AppDataSourceOptions)

	await dropDatabase({ifExist: true, options: AppDataSourceOptions, initialDatabase: "postgres"});
	await createDatabase({ifNotExist: true, options: AppDataSourceOptions, initialDatabase: "postgres"});

	ResponseBuilder.Ok(res);
}