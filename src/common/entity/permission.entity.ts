import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, ManyToMany, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./role.entity";

@Entity("permissions")
export class Permission extends BaseEntity {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ApiProperty({readOnly: true})
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({readOnly: true})
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({readOnly: true})
    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    // Relations
    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[]
}
