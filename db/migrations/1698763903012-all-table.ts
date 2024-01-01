import { MigrationInterface, QueryRunner } from "typeorm";

export class AllTable1698763903012 implements MigrationInterface {
    name = 'AllTable1698763903012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`upload_locals\` (\`id\` varchar(36) NOT NULL, \`filename\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`roles\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`avatarId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_3e1f52ec904aed992472f2be14\` (\`avatarId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` varchar(36) NOT NULL, \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`shortDescription\` varchar(255) NOT NULL DEFAULT '', \`fullDescription\` varchar(255) NOT NULL DEFAULT '', \`thumbnailUrl\` varchar(255) NOT NULL, \`tagList\` text NOT NULL, \`mdContent\` varchar(255) NOT NULL DEFAULT '', \`htmlContent\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`authorId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_categories\` (\`category_id\` varchar(36) NOT NULL, \`article_id\` varchar(36) NOT NULL, INDEX \`IDX_2074448c3764e149b3b0541c2a\` (\`category_id\`), INDEX \`IDX_6919cd26646fd24f7aac8166d4\` (\`article_id\`), PRIMARY KEY (\`category_id\`, \`article_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_3e1f52ec904aed992472f2be147\` FOREIGN KEY (\`avatarId\`) REFERENCES \`upload_locals\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_categories\` ADD CONSTRAINT \`FK_2074448c3764e149b3b0541c2a7\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`article_categories\` ADD CONSTRAINT \`FK_6919cd26646fd24f7aac8166d46\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_categories\` DROP FOREIGN KEY \`FK_6919cd26646fd24f7aac8166d46\``);
        await queryRunner.query(`ALTER TABLE \`article_categories\` DROP FOREIGN KEY \`FK_2074448c3764e149b3b0541c2a7\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_3e1f52ec904aed992472f2be147\``);
        await queryRunner.query(`DROP INDEX \`IDX_6919cd26646fd24f7aac8166d4\` ON \`article_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_2074448c3764e149b3b0541c2a\` ON \`article_categories\``);
        await queryRunner.query(`DROP TABLE \`article_categories\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`REL_3e1f52ec904aed992472f2be14\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`upload_locals\``);
    }

}
