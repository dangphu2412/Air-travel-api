import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
/**
 * Base entity with create, udpate, delete column
 */
export abstract class BaseActionDate extends BaseEntity {
  @ApiProperty({readOnly: true})
  @CreateDateColumn()
  public createdAt: Date;

  @ApiProperty({readOnly: true})
  @UpdateDateColumn()
  public updatedAt: Date;

  @ApiProperty({readOnly: true})
  @DeleteDateColumn({nullable: true})
  public deletedAt: Date;
}
