import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsNumber, IsOptional} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";

export class UpdateBillServiceDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    serviceId: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    netPrice: number;

    @ApiProperty({
      example: new Date().toISOString()
    })
    @IsRequired()
    @IsDateString()
    startDate: Date;

    @ApiProperty({
      example: new Date().toISOString()
    })
    @IsRequired()
    @IsDateString()
    endDate: Date;
}
