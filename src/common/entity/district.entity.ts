import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsOptional, IsNumber} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {City} from "./city.entity";
import {Destination} from ".";

@Entity("districts")
export class District extends BaseEntity {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: "Quận Liên Chiểu"})
  @IsRequired()
  @IsString()
  @Column()
  name: string;

  @ApiProperty({example: "Quan-Lien-Chieu"})
  @IsRequired()
  @IsString()
  @Column()
  slug: string;

  @ApiProperty({writeOnly: true, example: 1})
  @IsOptional()
  @IsNumber()
  cityId: number;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => City})
  @ManyToOne(() => City, city => city.districts)
  city: City

  @ApiProperty({readOnly: true, type: () => Destination})
  @OneToMany(() => Destination, destination => destination.district)
  destinations: Destination[]
}
