import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsEmpty} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {User} from "./user.entity";
import {Customer} from ".";

@Entity("notifications")
export class Notification extends BaseActionDate {
    @ApiProperty({readOnly: true})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @IsRequired()
    @IsString()
    @Column()
    title: string;

    @ApiProperty()
    @IsRequired()
    @IsString()
    @Column({
      type: "text"
    })
    body: string;

    /**
     * Relations
     */
    @ApiProperty({readOnly: true})
    @IsEmpty()
    @Column()
    customerId: number;

    @ApiProperty({readOnly: true, type: () => User})
    @ManyToOne(() => User, item => item.services)
    @JoinColumn({name: "customerId"})
    customer: Customer;
}

