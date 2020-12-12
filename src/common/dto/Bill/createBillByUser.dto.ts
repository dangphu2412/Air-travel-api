import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";
import {BillStatus} from "src/common/enums";
import {CreateBilLDto} from "./bill.dto";

export class CreateBillByUserDto extends CreateBilLDto {
    status = BillStatus.CUSTOMER_PAYING;

    @ApiProperty()
    @IsNumber()
    customerId: number;
}

