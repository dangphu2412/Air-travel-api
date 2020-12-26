import {ApiProperty} from "@nestjs/swagger";
import {IsIn, IsString, IsNumber, IsOptional} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";
import {EPayment} from "src/common/enums";
import {enumToArray} from "src/utils";

export class CreatePaymentDto {
    @ApiProperty({
      enum: EPayment
    })
    @IsRequired()
    @IsIn(enumToArray(EPayment))
    type: EPayment;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    billId: number;

    @ApiProperty()
    @IsRequired()
    @IsNumber()
    billInfoId: number;
}
