import {EPayment} from "../enums/paymentStatus.enum";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsIn, IsNumber} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Bill} from "./bill.entity";
import {BillInfo} from "./billInfo.entity";
import {enumToArray} from "../../utils";

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
  @IsRequired()
  @IsString()
  @Column({
    type: "text"
  })
  description: string;

  @ApiProperty()
  @IsRequired()
  @IsNumber()
  @Column()
  amount: number;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Bill})
  @ManyToOne(() => Bill, bill => bill.payments)
  bill: Bill

  @ApiProperty({readOnly: true, type: () => BillInfo})
  @ManyToOne(() => BillInfo, billInfo => billInfo.payments, {nullable: true})
  billInfo: BillInfo
}
