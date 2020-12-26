import {EPayment} from "../enums/paymentStatus.enum";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsIn, IsNumber, IsEmpty, IsOptional} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Bill} from "./bill.entity";
import {BillInfo} from "./billInfo.entity";
import {enumToArray} from "../../utils";
import {User} from ".";

@Entity("payments")
export class Payment extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsRequired()
  @IsIn(enumToArray(EPayment))
  @Column({
    type: "enum",
    enum: EPayment,
    default: EPayment.GET_IN
  })
  type: EPayment;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Column({
    type: "text",
    nullable: true
  })
  description: string;

  @ApiProperty()
  @IsRequired()
  @IsNumber()
  @Column()
  amount: number;


  /**
   * Relattion key
   */
  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  /**
   * Relations
   */

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.payments)
  @JoinColumn({name: "userId"})
  user: User;

  @ApiProperty({readOnly: true, type: () => Bill})
  @ManyToOne(() => Bill, bill => bill.payments)
  bill: Bill

  @ApiProperty({readOnly: true, type: () => BillInfo})
  @ManyToOne(() => BillInfo, billInfo => billInfo.payments, {nullable: true})
  billInfo: BillInfo
}
