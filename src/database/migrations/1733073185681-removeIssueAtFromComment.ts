import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIssueAtFromComment1733073185681 implements MigrationInterface {
    name = 'RemoveIssueAtFromComment1733073185681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "issueAt" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "createdAt" TO "issueAt"`);
    }

}
