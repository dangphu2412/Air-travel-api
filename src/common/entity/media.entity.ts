import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsEmpty} from "class-validator";

import {IsRequired} from "../decorators/isRequired.decorator";

import {BaseActionDate} from "./base";
import {User} from "./user.entity";

@Entity("medias")
@Unique(["url"])
export class Media extends BaseActionDate {
  @ApiProperty({readOnly: true})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsRequired()
  @IsString()
  @Column()
  url: string;

  /**
   * Relations
   */

  @ApiProperty({readOnly: true})
  @IsEmpty()
  @Column()
  userId: number;

  @ApiProperty({readOnly: true, type: () => User})
  @ManyToOne(() => User, item => item.medias, {eager: true})
  @JoinColumn({name: "userId"})
  user: User;
}
