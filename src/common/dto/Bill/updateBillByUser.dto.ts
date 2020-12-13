import {ApiProperty} from "@nestjs/swagger";
import {IsIn, IsNumber, IsString, ValidateNested} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";
import {BillStatus} from "src/common/enums";
import {enumToArray} from "src/utils";
import {UpdateBillServiceDto} from "../BillService/update.dto";
import {CreateBilLDto} from "./bill.dto";

export class UpdateBillByUserDto extends CreateBilLDto {
    @ApiProperty()
    @IsRequired()
    id: number;

    @ApiProperty()
    @IsNumber()
    customerId: number;

    @ApiProperty({
      example: "Note something"
    })
    @IsRequired()
    @IsString()
    note: string;

    @ValidateNested()
    billServices: UpdateBillServiceDto[];


    @IsIn(enumToArray(BillStatus))
    status: BillStatus;
}

