import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToComment1733050390626 implements MigrationInterface {
    name = 'AddCreatedAtToComment1733050390626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "createdAt"`);
    }

}
