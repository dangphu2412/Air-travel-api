import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";

export class CreateBillServiceDto {
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
}
