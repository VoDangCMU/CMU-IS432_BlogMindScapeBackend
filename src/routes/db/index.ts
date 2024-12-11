import { Request, Response, Router } from 'express';
import isNotProduction from '@root/middlewares/isNotProduction';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { AppDataSourceOptions } from '@database/DataSource';
import log from '@services/logger';
import ResponseBuilder from '@services/responseBuilder';
import MessageCodes from '@root/messageCodes';

const db = Router();

db.use(isNotProduction);
db.post('/purge', purgeDB);

module.exports = db;

export async function purgeDB(req: Request, res: Response) {
	try {
		await dropDatabase({
			ifExist: true,
			options: AppDataSourceOptions,
			initialDatabase: 'postgres',
		});
		await createDatabase({
			ifNotExist: true,
			options: AppDataSourceOptions,
			initialDatabase: 'postgres',
		});
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res, MessageCodes.DATABASE_BUSY);
	}

	ResponseBuilder.Ok(res);
}
