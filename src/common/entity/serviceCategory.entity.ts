import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeParent,
  TreeChildren,
  Tree,
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

import {Service} from "./service.entity";
import {User} from "./user.entity";
import {BaseActionDate} from "./base";

@Unique(["enSlug"])
@Unique(["viSlug"])
@Entity("service_categories")
@Tree("materialized-path")
export class ServiceCategory extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsRequired()
  @IsString()
  @Column()
  enName: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsRequired()
  @IsString()
  @Column()
  viName: string;

  @ApiProperty({
    example: "my-example-en"
  })
  @IsOptional()
  @IsString()
  @Column()
  enSlug: string;

  @ApiProperty({
    example: "my-example-vi"
  })
  @IsOptional()
  @IsString()
  @Column()
  viSlug: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  enDescription: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  viDescription: string;

  /**
   * Self Relations
   */
  @ApiProperty({readOnly: true})
  @IsOptional()
  @IsEmpty()
  @TreeParent()
  parent: ServiceCategory;

  @ApiProperty({readOnly: true})
  @IsOptional()
  @IsEmpty()
  @TreeChildren({cascade: true})
  children: ServiceCategory[];

  @ApiProperty()
  @IsNumber()
  parentId: number | string;

  @ApiProperty()
  @IsNumber()
  childrenId: number | string;

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => Service})
  @ManyToMany(() => Service, item => item.serviceCategories)
  services: Service[];

  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.serviceCategories, {eager: true})
  @JoinColumn({name: "userId"})
  user: User;
}
