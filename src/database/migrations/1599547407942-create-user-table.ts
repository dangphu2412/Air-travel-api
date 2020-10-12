import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateUserTable1599547407942 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "username",
            type: "varchar",
            isNullable: false,
            isUnique: true
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false
          },
          {
            name: "roleId",
            type: "int",
            isNullable: false,
            default: 3
          },
          {
            name: "createdAt",
            type: "date",
            default: "now()",
            isNullable: true
          },
          {
            name: "updatedAt",
            type: "date",
            default: "now()",
            isNullable: true
          },
          {
            name: "deletedAt",
            type: "date",
            default: null,
            isNullable: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey("users", new TableForeignKey({
      columnNames: ["roleId"],
      referencedColumnNames: ["id"],
      referencedTableName: "roles",
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }

}
