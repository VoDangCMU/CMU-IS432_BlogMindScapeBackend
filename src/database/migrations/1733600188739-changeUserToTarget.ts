import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserToTarget1733600188739 implements MigrationInterface {
    name = 'ChangeUserToTarget1733600188739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "userId" TO "targetId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_6814e77599ba2264a2a3fe5ad80" FOREIGN KEY ("targetId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_6814e77599ba2264a2a3fe5ad80"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "targetId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
