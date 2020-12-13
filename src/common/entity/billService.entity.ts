import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsNumber, IsOptional} from "class-validator";
import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Bill, Service} from ".";

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

  @ApiProperty({
    example: new Date().toISOString()
  })
  @IsRequired()
  @IsDateString()
  @Column({nullable: true})
  startDate: Date;

  @ApiProperty({
    example: new Date().toISOString()
  })
  @IsRequired()
  @IsDateString()
  @Column({nullable: true})
  endDate: Date;

  @ApiProperty({
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @Column({nullable: true})
  serviceId: number;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Bill})
  @ManyToOne(() => Bill, bill => bill.billServices)
  bill: Bill

  @ApiProperty({readOnly: true, type: () => Service})
  @ManyToOne(() => Service, service => service.billServices)
  service: Service
}
