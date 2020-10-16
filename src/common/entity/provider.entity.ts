import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, ManyToMany, ManyToOne, JoinColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsIn, IsDateString, IsMobilePhone, IsEmpty} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";
import {Gender} from "../enums/gender.enum";

import {BaseActionDate} from "./base";
import {BillInfo} from "./billInfo.entity";
import {Service} from "./service.entity";
import {User} from "./user.entity";
import {enumToArray} from "../../utils";

@Entity("providers")
export class Provider extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  email: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  avatar: string;

  @ApiProperty()
  @IsRequired()
  @IsIn(enumToArray(Gender))
  @Column({
    type: "enum",
    enum: Gender
  })
  gender: Gender;

  @ApiProperty({
    example: new Date().toISOString()
  })
  @IsRequired()
  @IsDateString()
  @Column()
  birthday: Date;

  @ApiProperty({
    example: "0371627261"
  })
  @IsRequired()
  @IsMobilePhone("vi-VN")
  @Column()
  phone: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column({
    type: "text"
  })
  note: string;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => BillInfo})
  @OneToMany(() => BillInfo, info => info.provider)
  billInfos: BillInfo[]

  @ApiProperty({readOnly: true, type: () => Service})
  @ManyToMany(() => Service, service => service.providers)
  services: Service[]

  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.services, {eager: true})
  @JoinColumn({name: "userId"})
  user: User;
}
