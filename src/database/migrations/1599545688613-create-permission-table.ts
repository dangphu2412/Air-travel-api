import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreatePermissionTable1599545688613 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'permissions',
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
                    name: 'moduleId',
                    type: 'int',
                  },
                  {
                    name: 'methodId',
                    type: 'int',
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

        await queryRunner.createForeignKey('permissions', new TableForeignKey({
          columnNames: ["moduleId"],
          referencedColumnNames: ["id"],
          referencedTableName: "modules",
          onUpdate: "CASCADE"
        }))

        await queryRunner.createForeignKey('permissions', new TableForeignKey({
          columnNames: ["methodId"],
          referencedColumnNames: ["id"],
          referencedTableName: "methods",
          onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('permissions');
    }

}
