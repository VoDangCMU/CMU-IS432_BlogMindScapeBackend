import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUser1733920136210 implements MigrationInterface {
    name = 'AddAvatarToUser1733920136210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying NOT NULL DEFAULT 'blank-avatar.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
