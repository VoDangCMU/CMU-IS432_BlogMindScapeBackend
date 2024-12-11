import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNotificationTableStructre1733597746146
	implements MigrationInterface
{
	name = 'ChangeNotificationTableStructre1733597746146';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "notification" ("id" BIGSERIAL NOT NULL, "read" boolean NOT NULL, "interaction" character varying NOT NULL, "userId" bigint, "interactorId" bigint, CONSTRAINT "CHK_5a7606f5b38f517b04125ccd3b" CHECK ("interaction" = 'upvote' or "interaction" = 'downvote' or "interaction" = 'comment'), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_c54ec31904555bbd1a2df2513d9" FOREIGN KEY ("interactorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_c54ec31904555bbd1a2df2513d9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
		);
		await queryRunner.query(`DROP TABLE "notification"`);
	}
}
