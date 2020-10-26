import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "admin@gmail.com"
  })
  @IsString()
  public email: string;

  @ApiProperty({
    example: "ADMIN"
  })
  @IsString()
  public password: string;
}
