import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {IsString, IsNumber, IsIn} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

import {BillStatus} from "../enums/billStatus.enum";
import {IsRequired} from "../decorators/isRequired.decorator";

import {Customer} from "./customer.entity";
import {Payment} from "./payment.entity";
import {BillService} from "./billService.entity";
import {BaseActionDate} from "./base";
import {enumToArray} from "../../utils";

@Entity("bills")
export class Bill extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1200000
  })
  @IsRequired()
  @IsNumber()
  @Column()
  totalPrice: number;

  @ApiProperty({
    example: "Note something"
  })
  @IsRequired()
  @IsString()
  @Column({
    type: "text"
  })
  note: string;

  @ApiProperty({
    example: new Date().toISOString()
  })
  @IsRequired()
  @ApiProperty({readOnly: true})
  @Column({
    type: "date"
  })
  deadline: Date;

  @ApiProperty({readOnly: true})
  @IsRequired()
  @IsIn(enumToArray(BillStatus))
  @Column({
    type: "enum",
    enum: BillStatus,
    default: BillStatus.PENDING
  })
  status: string;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Customer})
  @ManyToOne(() => Customer, customer => customer.bills)
  customer: Customer

  @ApiProperty({readOnly: true, type: () => Payment})
  @OneToMany(() => Payment, payment => payment.bill)
  payments: Payment[]

  @ApiProperty({readOnly: true, type: () => BillService})
  @OneToMany(() => BillService, billService => billService.bill)
  billServices: BillService[]
}