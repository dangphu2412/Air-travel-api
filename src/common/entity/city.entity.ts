import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, BaseEntity} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {Destination} from "./destination.entity";
import {District} from "./district.entity";

@Entity("cities")
@Unique(["name", "slug"])
export class City extends BaseEntity {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Đà Nẵng"
  })
  @IsRequired()
  @IsString()
  @Column()
  name: string;

  @ApiProperty({
    example: "Da-Nang"
  })
  @IsRequired()
  @IsString()
  @Column()
  slug: string;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Destination})
  @OneToMany(() => Destination, location => location.city)
  destinations: Destination[]

  @ApiProperty({readOnly: true, type: () => District})
  @OneToMany(() => District, district => district.city)
  districts: District[]
}
