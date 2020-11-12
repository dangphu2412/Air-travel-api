import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";
import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Bill} from "./bill.entity";

@Entity("billServices")
export class BillService extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsRequired()
  @IsNumber()
  @Column()
  quantity: number;

  @ApiProperty()
  @IsRequired()
  @IsNumber()
  @Column()
  price: number;

  @ApiProperty()
  @IsRequired()
  @IsNumber()
  @Column()
  netPrice: number;

  // @ApiProperty({
  //   example: new Date().toISOString()
  // })
  // @IsRequired()
  // @IsDateString()
  // @Column()
  // startDay: Date;

  // @ApiProperty({
  //   example: new Date().toISOString()
  // })
  // @IsRequired()
  // @IsDateString()
  // @Column()
  // endDate: Date;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Bill})
  @ManyToOne(() => Bill, bill => bill.billServices)
  bill: Bill
}
