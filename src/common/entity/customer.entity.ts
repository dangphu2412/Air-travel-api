import {ApiProperty} from "@nestjs/swagger";
import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, Unique, BeforeInsert, BeforeUpdate,
  ManyToOne
} from "typeorm";
import {
  IsString, IsEmail, IsMobilePhone,
  IsOptional, IsIn, IsDateString, IsBoolean, IsArray
} from "class-validator";
import {Exclude} from "class-transformer";
import {Gender} from "../enums/gender.enum";
import {IsRequired} from "../decorators/isRequired.decorator";
import {BaseActionDate} from "./base";
import {Bill} from "./bill.entity";
import {BillInfo} from "./billInfo.entity";
import {Role} from "./role.entity";
import {enumToArray} from "../../utils";
import {BcryptService} from "../../global/bcrypt";

@Entity("customers")
@Unique(["email"])
export class Customer extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "user"
  })
  @IsRequired()
  @IsString()
  @Column()
  fullName: string;

  @ApiProperty({
    example: "user@gmail.com"
  })
  @IsEmail()
  @IsRequired()
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({
    example: "123123"
  })
  @ApiProperty({writeOnly: true})
  @IsRequired()
  @IsString()
  @Column()
  password: string;

  @ApiProperty({
    example: "0371627261"
  })
  @IsRequired()
  @IsMobilePhone("vi-VN")
  @Column({
    nullable: true
  })
  phone: string;

  @ApiProperty({
    example: "https://encrypted-tbn0.gstatic.com/images?" +
    "q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU"
  })
  @IsOptional()
  @IsString()
  @Column({
    default: "https://encrypted-tbn0.gstatic.com/images?" +
  "q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
    nullable: true
  })
  avatar: string;

  @ApiProperty({
    example: Gender.MALE
  })
  @IsRequired()
  @IsIn(enumToArray(Gender))
  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.MALE
  })
  gender: string;

  @ApiProperty({
    example: new Date().toISOString()
  })
  @IsRequired()
  @IsDateString()
  @Column({
    nullable: true
  })
  birthday: Date;

  @ApiProperty({
    example: "Hello there"
  })
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Column({
    nullable: true
  })
  bio: string;

  @ApiProperty({
    example: "Note something"
  })
  @IsOptional()
  @IsString()
  @Column({
    nullable: true
  })
  note: string;

  @Exclude()
  @ApiProperty({readOnly: true, writeOnly: true})
  @IsOptional()
  @IsBoolean()
  @Column({default: false})
  hasExpiredToken: boolean;


  @Exclude()
  @ApiProperty({readOnly: true, writeOnly: true})
  @IsOptional()
  @IsArray()
  @Column({nullable: true, type: "simple-array"})
  notifyTokens: string[];

  // For getting favourites service
  @ApiProperty({readOnly: false, writeOnly: true})
  @Column("simple-array", {
    nullable: true
  })
  favouriteServiceIds: number[]

  // Trigger
  @BeforeInsert()
  hashPassword() {
    this.password = BcryptService.hash(this.password);
  }

  @BeforeUpdate()
  async triggerBeforeUpdate() {
    const userRepository = Customer.getRepository();
    const currentUser = await userRepository.findOne(this.id, {
      select: ["id", "password"]
    });
    if (
      !BcryptService.compare(this.password, currentUser.password)
      && this.password !== currentUser.password
    )
      this.password = BcryptService.hash(this.password);
  }
  /**
   * Relations
   */

  @ApiProperty({readOnly: true, type: () => Role})
  @ManyToOne(() => Role, item => item.customers)
  role: Role;

  @ApiProperty({readOnly: true, type: () => Bill})
  @OneToMany(() => Bill, bill => bill.customer)
  bills: Bill[]

  @ApiProperty({readOnly: true, type: () => BillInfo})
  @OneToMany(() => BillInfo, info => info.customer)
  billInfos: BillInfo[]
}
