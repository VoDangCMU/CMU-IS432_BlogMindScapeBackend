import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValueToRead1733600296000 implements MigrationInterface {
	name = 'AddDefaultValueToRead1733600296000';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "read" SET DEFAULT false`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "read" DROP DEFAULT`,
		);
	}
}
