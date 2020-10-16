import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./role.entity";
import {BaseActionDate} from "./base";

@Entity("permissions")
export class Permission extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // Relations
    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[]
}
