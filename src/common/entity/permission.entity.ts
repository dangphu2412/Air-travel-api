import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Method } from "./method.entity";
import { Module } from "./module.entity";
import { Role } from "./role.entity";

@Entity('permissions')
export class Permission extends BaseEntity {
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
    @ManyToOne(() => Method, { eager: true })
    method: Method

    @ManyToOne(() => Module, { eager: true })
    module: Module

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[]
}