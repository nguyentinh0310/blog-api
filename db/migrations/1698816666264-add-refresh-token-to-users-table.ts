import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUsersTable21698816666264 implements MigrationInterface {
    name = 'AddRefreshTokenToUsersTable21698816666264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
