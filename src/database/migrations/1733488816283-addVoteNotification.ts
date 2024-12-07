import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVoteNotification1733488816283 implements MigrationInterface {
    name = 'AddVoteNotification1733488816283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote_notification" ("id" BIGSERIAL NOT NULL, "read" boolean NOT NULL, "interaction" character varying NOT NULL, "userId" bigint, "interactorId" bigint, CONSTRAINT "CHK_622d52a8f63ef29b298d1b3f5f" CHECK ("interaction" = 'upvote' or "interaction" = 'downvote'), CONSTRAINT "PK_2db98c57a658d48e27fdffa0b18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vote_notification" ADD CONSTRAINT "FK_177039f004f6875bb9b43178f73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_notification" ADD CONSTRAINT "FK_93b02be261334855d34d2475939" FOREIGN KEY ("interactorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote_notification" DROP CONSTRAINT "FK_93b02be261334855d34d2475939"`);
        await queryRunner.query(`ALTER TABLE "vote_notification" DROP CONSTRAINT "FK_177039f004f6875bb9b43178f73"`);
        await queryRunner.query(`DROP TABLE "vote_notification"`);
    }

}
