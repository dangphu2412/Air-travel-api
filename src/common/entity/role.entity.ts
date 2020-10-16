import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, OneToMany, JoinTable
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Permission} from "./permission.entity";
import {User} from "./user.entity";
import {BaseActionDate} from "./base";

@Entity("roles")
export class Role extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // Relations
    @ManyToMany(() => Permission, permission => permission.roles, {eager: true})
    @JoinTable({
      name: "role_permissions",
      joinColumn: {
        name: "roleId",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "permissionId",
        referencedColumnName: "id"
      }
    })
    permissions: Permission[]

    @OneToMany(() => User, user => user.role)
    users: User[]
}
