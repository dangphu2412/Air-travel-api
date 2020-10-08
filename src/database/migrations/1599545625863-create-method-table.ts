import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMethodTable1599545625863 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'methods',
              columns: [
                  {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                  },
                  {
                    name: 'name',
                    type: 'varchar',
                    isUnique: true,
                  },
                  {
                    name: 'createdAt',
                    type: 'date',
                    default: 'now()',
                    isNullable: true,
                  },
                  {
                    name: 'updatedAt',
                    type: 'date',
                    default: 'now()',
                    isNullable: true,
                  },
                  {
                    name: 'deletedAt',
                    type: 'date',
                    default: null,
                    isNullable: true,
                  },
              ]  
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('methods')
    }

}
