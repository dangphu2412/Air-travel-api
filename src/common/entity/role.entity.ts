import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";

@Entity('roles')
export class Role extends BaseEntity {
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
    @ManyToMany(() => Permission, permission => permission.roles, { eager: true })
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
          name: 'roleId',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'permissionId',
          referencedColumnName: 'id'
        }
    })
    permissions: Permission[]

    @OneToMany(() => User, user => user.role)
    users: User[]
}