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
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEmpty
} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {Service} from "./service.entity";
import {User} from "./user.entity";
import {BaseActionDate} from "./base";
import {SlugHelper} from "../../global/slugify";

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

  @IsOptional()
  @IsString()
  @Column()
  enSlug: string;

  @IsOptional()
  @IsString()
  @Column()
  viSlug: string;

  /**
   * Trigger
   */
  @BeforeInsert()
  @BeforeUpdate()
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

  @ApiProperty()
  parentId: number | string;

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
  @ManyToOne(() => User, item => item.serviceCategories)
  @JoinColumn({name: "userId"})
  user: User;
}
