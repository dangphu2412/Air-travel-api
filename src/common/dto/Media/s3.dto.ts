import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class S3Dto {
  @ApiProperty({
    example: "image"
  })
  @IsOptional()
  type: string;

  @ApiProperty({
    example: "Phudeptrai"
  })
  @IsOptional()
  fileName: string;

  @ApiProperty({
    example: "src"
  })
  @IsOptional()
  folderPrefix: string;
}
