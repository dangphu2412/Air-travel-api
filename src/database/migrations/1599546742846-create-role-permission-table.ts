import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateRolePermissionTable1599546742846 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "role_permissions",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "roleId",
            type: "int",
            isNullable: false
          },
          {
            name: "permissionId",
            type: "int",
            isNullable: false
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
    await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
      columnNames: ["roleId"],
      referencedColumnNames: ["id"],
      referencedTableName: "roles",
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }))

    await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
      columnNames: ["permissionId"],
      referencedColumnNames: ["id"],
      referencedTableName: "permissions",
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("role_permissions");
  }

}
