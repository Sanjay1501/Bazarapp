import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLCategory1733117270631 implements MigrationInterface {
    name = 'AddTBLCategory1733117270631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Categories" ADD CONSTRAINT "FK_9e14f00d387e3712b7a061f24b2" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Categories" DROP CONSTRAINT "FK_9e14f00d387e3712b7a061f24b2"`);
        await queryRunner.query(`DROP TABLE "Categories"`);
    }

}
