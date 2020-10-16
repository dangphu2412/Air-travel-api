import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, BeforeInsert, BeforeUpdate, OneToMany
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./role.entity";
import {BcryptService} from "../../global/bcrypt";
import {BaseActionDate} from "./base";
import {Destination, Media, Provider, Service, ServiceCategory} from ".";

@Entity("users")
export class User extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPwd() {
      this.password = BcryptService.hash(this.password);
    }

    // Relations
    @ManyToOne(() => Role)
    role: Role

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Media})
    @OneToMany(() => Media, item => item.userId, {eager: false})
    medias: Media[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Destination})
    @OneToMany(() => Destination, item => item.userId, {eager: false})
    destinations: Destination[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => ServiceCategory})
    @OneToMany(() => ServiceCategory, item => item.userId, {eager: false})
    serviceCategories: ServiceCategory[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Service})
    @OneToMany(() => Service, item => item.userId, {eager: false})
    services: Service[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Provider})
    @OneToMany(() => Provider, item => item.userId, {eager: false})
    providers: Provider[];
}
