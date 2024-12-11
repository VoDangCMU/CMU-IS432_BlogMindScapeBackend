import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateToUpDownVote1733931258785 implements MigrationInterface {
    name = 'AddDateToUpDownVote1733931258785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upvote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "downvote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "downvote" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "upvote" DROP COLUMN "createdAt"`);
    }

}
