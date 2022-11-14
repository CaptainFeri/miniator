import { MigrationInterface, QueryRunner } from "typeorm";

export class adminEntityMig1668437124767 implements MigrationInterface {
    name = 'adminEntityMig1668437124767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ADMIN" ("id" SERIAL NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_date" TIMESTAMP WITH TIME ZONE, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_41796e3ec19968652ea1abb9a92" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ADMIN"`);
    }

}
