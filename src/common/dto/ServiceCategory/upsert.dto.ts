import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsOptional, IsNumber} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";

export class UpsertServiceCategoryDto {
  @ApiProperty({
    example: "My Example (English)"
  })
  @IsRequired()
  @IsString()

  enName: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsRequired()
  @IsString()

  viName: string;

  @ApiProperty({
    example: "my-example-en"
  })
  @IsOptional()
  @IsString()

  enSlug: string;

  @ApiProperty({
    example: "my-example-vi"
  })
  @IsOptional()
  @IsString()

  viSlug: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  enDescription: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  viDescription: string;

  @ApiProperty()
  @IsNumber()
  parentId: number | string;

  @ApiProperty()
  @IsNumber()
  childrenId: number | string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
