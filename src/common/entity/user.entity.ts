import {IsNumber} from "class-validator";
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, BeforeInsert, BeforeUpdate, OneToMany, Unique
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./role.entity";
import {BcryptService} from "../../global/bcrypt";
import {BaseActionDate} from "./base";
import {Destination, Media, Provider, Service, ServiceCategory} from ".";
import {IsRequired} from "../decorators/isRequired.decorator";
import {Exclude} from "class-transformer";
import {
  IsMobilePhone, IsOptional, IsString, IsIn,
  IsDateString, IsBoolean, IsEmail} from "class-validator";
import {enumToArray} from "../../utils";
import {Gender, UserStatus} from "../enums";
import {Bill} from "./bill.entity";
import { Payment } from "./payment.entity";

@Entity("users")
@Unique(["email"])
export class User extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
      example: "Phu dep trai"
    })
    @Column()
    @IsRequired()
    fullName: string;

    @ApiProperty({
      example: "admin@gmail.com"
    })
    @IsRequired()
    @IsEmail()
    @Column()
    email: string;

    @Column()
    @IsRequired()
    password: string;

    @ApiProperty({
      example: "0371627261"
    })
    @IsOptional()
    @IsMobilePhone("vi-VN")
    @Column()
    phone: string;

    @ApiProperty({
      example: "https://encrypted-tbn0.gstatic.com/images?" +
      "q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU"
    })
    @IsOptional()
    @IsString()
    @Column({default: "https://encrypted-tbn0.gstatic.com/images?" +
    "q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU"})
    avatar: string;

    @ApiProperty({
      example: Gender.MALE
    })
    @IsRequired()
    @IsIn(enumToArray(Gender))
    @Column({
      type: "enum",
      enum: Gender
    })
    gender: string;

    @ApiProperty({
      example: new Date().toISOString()
    })
    @IsRequired()
    @IsDateString()
    @Column()
    birthday: Date;

    @ApiProperty({
      example: "Hello there"
    })
    @IsOptional()
    @IsString()
    @Column({nullable: true})
    bio: string;

    @ApiProperty({
      example: "Note something"
    })
    @IsOptional()
    @IsString()
    @Column({nullable: true})
    note: string;

    @ApiProperty({
      example: UserStatus.ACTIVE
    })
    @IsRequired()
    @IsIn(enumToArray(UserStatus))
    @Column({
      type: "enum",
      enum: UserStatus,
      default: UserStatus.ACTIVE
    })
    status: string;

    @Exclude()
    @ApiProperty({readOnly: true, writeOnly: true})
    @IsOptional()
    @IsBoolean()
    @Column({default: false})
    hasExpiredToken: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    hashPwd() {
      this.password = BcryptService.hash(this.password);
    }

    /**
     * Key relations
     */

    @ApiProperty({writeOnly: true, type: () => Role})
    @IsRequired()
    @IsNumber()
    roleId: number;

    /**
     * Relations
     */
    @ManyToOne(() => Role)
    role: Role

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Media})
    @OneToMany(() => Media, item => item.userId)
    medias: Media[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Destination})
    @OneToMany(() => Destination, item => item.userId)
    destinations: Destination[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => ServiceCategory})
    @OneToMany(() => ServiceCategory, item => item.userId)
    serviceCategories: ServiceCategory[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Service})
    @OneToMany(() => Service, item => item.userId)
    services: Service[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Provider})
    @OneToMany(() => Provider, item => item.userId)
    providers: Provider[];

    @ApiProperty({readOnly: true, writeOnly: true, type: () => Bill})
    @OneToMany(() => Bill, item => item.userId)
    bills: Provider[];


    @ApiProperty({readOnly: true, writeOnly: true, type: () => Payment})
    @OneToMany(() => Bill, item => item.userId)
    payments: Payment[];
}
