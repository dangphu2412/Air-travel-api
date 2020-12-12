import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

// Register for customer
export class RegisterDto {
  @ApiProperty({
    example: "phu dep trai"
  })
  @IsString()
  public fullName: string;

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

  @ApiProperty({
    example: "0964485641"
  })
  @IsString()
  public phone: string;
}
