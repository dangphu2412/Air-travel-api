import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmpty} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {Customer, Service} from ".";

@Entity("comments")
export class Comment extends BaseActionDate {
      @ApiProperty({readOnly: true})
      @PrimaryGeneratedColumn()
      id: number;

      @ApiProperty()
      @IsRequired()
      @IsEmpty()
      @Column({
        type: "text",
        nullable: false
      })
      content: string;

      /**
       * Relations
       */
      @ApiProperty({readOnly: true})
      @IsEmpty()
      @Column()
      customerId: number;

      @ApiProperty({readOnly: true})
      @IsEmpty()
      @Column()
      serviceId: number;

      @ApiProperty({readOnly: true, type: () => Customer})
      @ManyToOne(() => Customer, item => item.customer)
      @JoinColumn({name: "customerId"})
      customer: Customer;

      @ApiProperty({readOnly: true, type: () => Service})
      @ManyToOne(() => Service, item => item.comments)
      @JoinColumn({name: "serviceId"})
      service: Service;
}


