import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, IsNumber, Min} from "class-validator";

export class UpsertServiceDto {
  @ApiProperty({
    example: "Example Engrisk"
  })
  @IsString()
  enTitle: string;

  @ApiProperty({
    example: "Ví dụ tiếng việt"
  })
  @IsString()
  viTitle: string;

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

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsOptional()
  @IsString()
  enDescription: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsOptional()
  @IsString()
  viDescription: string;

  @ApiProperty({
    example: "My Example (English)"
  })
  @IsOptional()
  @IsString()
  enContent: string;

  @ApiProperty({
    example: "My Example (Vietnamese)"
  })
  @IsOptional()
  @IsString()
  viContent: string;

  @ApiProperty({
    example: "Note"
  })
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty({
    example: "http://img.png"
  })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiProperty({
    example: [
      "cc.img",
      "cc1.img"
    ]
  })
  gallery: Array<string>;

  @ApiProperty({
    example: 1000000,
    description: "Price"
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 1800000,
    description: "The final price applies to products on the website"
  })
  @IsNumber()
  currentPrice: number;

  @ApiProperty({
    example: 1500000,
    description: "The price negotiated with partners"
  })
  @IsNumber()
  netPrice: number;

  @ApiProperty({
    example: "Xe",
    description: "Unit for calculating"
  })
  @IsString()
  unit: string;

  @ApiProperty({writeOnly: true, example: [1, 2]})
  @IsOptional()
  @IsNumber({}, {each: true})
  @Min(1, {each: true})
  serviceCategoryIds: Array<number>;

  @ApiProperty({writeOnly: true, example: [1, 2]})
  @IsOptional()
  @IsNumber({}, {each: true})
  @Min(1, {each: true})
  destinationIds: Array<number>;

  @ApiProperty({writeOnly: true, example: [1, 2]})
  @IsOptional()
  @IsNumber({}, {each: true})
  @Min(1, {each: true})
  providerIds: Array<number>;
}
