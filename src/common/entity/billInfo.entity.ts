import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Customer} from "./customer.entity";
import {Provider} from "./provider.entity";
import {Payment} from "./payment.entity";

@Entity("bill_infos")
export class BillInfo extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  note: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  bankAccount: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  bankName: string;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  bankNumber: string;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Customer})
  @ManyToOne(() => Customer, customer => customer.billInfos)
  customer: Customer;

  @ApiProperty({readOnly: true, type: () => Provider})
  @ManyToOne(() => Provider, provider => provider.billInfos)
  provider: Provider;

  @ApiProperty({readOnly: true, type: () => Payment})
  @OneToMany(() => Payment, payment => payment.billInfo)
  payments: Payment[];
}
