/* eslint-disable max-len */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  ManyToMany,
  ManyToOne,
  JoinColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEmpty,
  IsNumber
} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";
import {BaseActionDate} from "./base";
import {User} from "./user.entity";
import {Service} from "./service.entity";
import {City, District} from ".";
import {SlugHelper} from "../../global/slugify";

@Unique(["enSlug"])
@Unique(["viSlug"])
@Entity("destinations")
export class Destination extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsRequired()
  @Column()
  enName: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsRequired()
  @Column()
  viName: string;

  @ApiProperty({
    example: "my-example-en"
  })
  @IsOptional()
  @Column()
  enSlug: string;

  @ApiProperty({
    example: "my-example-vi"
  })
  @IsOptional()
  @Column()
  viSlug: string;

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsOptional()
  @Column({nullable: true})
  enDescription: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsOptional()
  @Column({nullable: true})
  viDescription: string;

  @ApiProperty({
    example: "My Example (English)"
  })
  @Column({nullable: true})
  enContent: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @Column({nullable: true})
  viContent: string;

  @ApiProperty({
    example: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  thumbnail: string;

  @ApiProperty({
    example: "123 đường hoàng hoa thám"
  })
  @IsRequired()
  @IsString()
  @Column({
    type: "text",
    nullable: true
  })
  address: string;

  @ApiProperty({
    example: 23.55
  })
  @IsRequired()
  @IsNumber()
  @Column({
    type: "float"
  })
  longitude: number;

  @ApiProperty({
    example: 12.55
  })
  @IsRequired()
  @IsNumber()
  @Column({
    type: "float"
  })
  latitude: number;

  @ApiProperty({writeOnly: true, example: "Hà nội"})
  @IsRequired()
  @IsString()
  cityName: string;

  @ApiProperty({writeOnly: true, example: "Quận ba đình"})
  @IsRequired()
  @IsString()
  districtName: string;

  /**
   * Trigger
   */
  @BeforeInsert()
  async beforeInsert() {
    SlugHelper.slugifyColumns(this, [
      {
        name: "enSlug",
        value: SlugHelper.slugify(this.enName)
      },
      {
        name: "viSlug",
        value: SlugHelper.slugify(this.viName)
      }
    ])
  }

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Service})
  @ManyToMany(() => Service, item => item.destinations)
  services: Service[];

  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.destinations, {eager: true})
  @JoinColumn({name: "userId"})
  user: User;

  @ApiProperty({readOnly: true, type: () => City})
  @ManyToOne(() => City, city => city.destinations)
  city: City

  @ApiProperty({readOnly: true, type: () => District})
  @ManyToOne(() => District, district => district.destinations)
  district: District
}
