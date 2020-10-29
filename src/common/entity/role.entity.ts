import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, OneToMany, JoinTable
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Permission} from "./permission.entity";
import {User} from "./user.entity";
import {BaseActionDate} from "./base";
import {IsRequired} from "../decorators/isRequired.decorator";
import {IsOptional, IsNumber} from "class-validator";

@Entity("roles")
export class Role extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsRequired()
    name: string;

    /**
     * Map relation keys
     */
    @ApiProperty({writeOnly: true, example: [2, 3]})
    @IsOptional()
    @IsNumber({}, {each: true})
    permissionIds: Array<number>;

    /**
     * Relations
     */
    @ApiProperty({readOnly: true})
    @ManyToMany(() => Permission, permission => permission.roles)
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

    @ApiProperty({readOnly: true})
    @OneToMany(() => User, user => user.role)
    users: User[]
}
