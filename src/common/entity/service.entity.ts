import {SlugHelper} from "../../global/slugify";
import {
  Entity, PrimaryGeneratedColumn, Column,
  Unique, BeforeInsert, ManyToMany,
  JoinTable, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, IsNumber, IsEmpty} from "class-validator";

import {User} from "./user.entity";
import {Provider} from "./provider.entity";
import {ServiceCategory} from "./serviceCategory.entity";
import {Destination} from "./destination.entity";
import {BaseActionDate} from "./base";
import {BillService} from "./billService.entity";
import {Comment} from "./comment.entity";

@Entity("services")
@Unique(["enSlug", "viSlug"])
export class Service extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Example Engrisk"
  })
  @IsString()
  @Column()
  enTitle: string;

  @ApiProperty({
    example: "Ví dụ tiếng việt"
  })
  @IsString()
  @Column()
  viTitle: string;

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

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  enDescription: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  viDescription: string;

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  enContent: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  viContent: string;

  @ApiProperty({
    example: "Note"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  note: string;

  @ApiProperty({
    example: "http://img.png"
  })
  @IsOptional()
  @IsString()
  @Column({nullable: true})
  thumbnail: string;

  @ApiProperty({
    example: [
      "cc.img",
      "cc1.img"
    ]
  })
  @Column({nullable: true, type: "simple-array"})
  gallery: Array<string>;

  @ApiProperty({
    example: 1000000,
    description: "Price"
  })
  @IsNumber()
  @Column({default: 0, nullable: true})
  price: number;

  @ApiProperty({
    example: 1800000,
    description: "The final price applies to products on the website"
  })
  @IsNumber()
  @Column({default: 0, nullable: true})
  currentPrice: number;

  @ApiProperty({
    example: 1500000,
    description: "The price negotiated with partners"
  })
  @IsNumber()
  @Column({default: 0, nullable: true})
  netPrice: number;

  @ApiProperty({
    example: "Xe",
    description: "Unit for calculating"
  })
  @IsString()
  @Column()
  unit: string;

  /**
  * Map relation keys
  */
 @ApiProperty({writeOnly: true, example: [2, 3]})
 @IsOptional()
 @IsNumber({}, {each: true})
 serviceCategoryIds: number[];

 @ApiProperty({writeOnly: true, example: [2, 3]})
 @IsOptional()
 @IsNumber({}, {each: true})
 destinationIds: number[];

 @ApiProperty({writeOnly: true, example: [2, 3]})
 @IsOptional()
 @IsNumber({}, {each: true})
 providerIds: number[];

  /**
   * Trigger
   */
  @BeforeInsert()
 async beforeInsert() {
   SlugHelper.slugifyColumns(this, [
     {
       name: "enSlug",
       value: SlugHelper.slugify(this.enTitle)
     },
     {
       name: "viSlug",
       value: SlugHelper.slugify(this.viTitle)
     }
   ])
 }

  /**
   * Relations
   */
  @ApiProperty({readOnly: true, type: () => ServiceCategory})
  @ManyToMany(() => ServiceCategory, item => item.services, {
    cascade: true
  })
  @JoinTable({
    name: "service_service_categories",
    joinColumn: {
      name: "serviceId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "serviceCategoryId",
      referencedColumnName: "id"
    }
  })
  serviceCategories: ServiceCategory[];

  @ApiProperty({readOnly: true, type: () => Destination})
  @ManyToMany(() => Destination, item => item.services, {
    cascade: true
  })
  @JoinTable({
    name: "service_destinations",
    joinColumn: {
      name: "serviceId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "destinationId",
      referencedColumnName: "id"
    }
  })
  destinations: Destination[];

  @ApiProperty({readOnly: true})
  @ManyToMany(() => Provider, provider => provider.services, {
    cascade: true
  })
  @JoinTable({
    name: "service_providers",
    joinColumn: {
      name: "serviceId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "providerId",
      referencedColumnName: "id"
    }
  })
  providers: Provider[]

  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.services)
  @JoinColumn({name: "userId"})
  user: User;

  @ApiProperty({readOnly: true, type: () => BillService})
  @OneToMany(() => BillService, item => item.service)
  @JoinColumn()
  billServices: BillService[]

  @ApiProperty({readOnly: true, type: () => BillService})
  @OneToMany(() => Comment, item => item.service)
  @JoinColumn()
  comments: BillService[]
}
