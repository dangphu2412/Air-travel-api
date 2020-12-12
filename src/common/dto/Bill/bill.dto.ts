import {ApiProperty} from "@nestjs/swagger";
import {IsString, ValidateNested} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";
import {BillStatus} from "src/common/enums";
import {CreateBillServiceDto} from "../BillService";

export class CreateBilLDto {
    @ApiProperty({
      example: "Note something"
    })
    @IsRequired()
    @IsString()
    note: string;

    @ValidateNested()
    billServices: CreateBillServiceDto[];

    status: BillStatus;
}
