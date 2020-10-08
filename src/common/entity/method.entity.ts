import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "./permission.entity";

@Entity('methods')
export class Method extends BaseEntity {
    @ApiProperty({ readOnly: true })
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ApiProperty({ readOnly: true })
    @CreateDateColumn()
    createdAt: Date;
  
    @ApiProperty({ readOnly: true })
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ApiProperty({ readOnly: true })
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    // Relations
    @OneToMany(() => Permission, (permission) => permission.method)
    permissions: Permission
}
