import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, Min} from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    example: "SUPER_NURSE"
  })
  @IsString()
  name: string;


  @ApiProperty({writeOnly: true, example: [2, 3]})
  @IsOptional()
  @IsNumber({}, {each: true})
  @Min(2, {each: true})
  permissionIds: Array<number>;
}
