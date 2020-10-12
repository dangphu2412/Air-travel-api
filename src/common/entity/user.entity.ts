import {
  Entity, PrimaryGeneratedColumn, Column,
  BaseEntity, ManyToOne, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
  BeforeInsert, BeforeUpdate} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./role.entity";
import {BcryptService} from "../../global/bcrypt";

@Entity("users")
export class User extends BaseEntity {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @BeforeInsert()
    hashPwd() {
      this.password = BcryptService.hash(this.password);
    }

    @BeforeUpdate()
    hashPwdUpdate() {
      this.password = BcryptService.hash(this.password);
    }

    // Relations
    @ManyToOne(() => Role)
    role: Role
}
