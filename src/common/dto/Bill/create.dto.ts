import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsNumber} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";
import {BillStatus} from "src/common/enums";
import {Column} from "typeorm";
import {CreateBillServiceDto} from "../BillService";

export class CreateBilLDto {
    // Prefix
    status = BillStatus.CUSTOMER_PAYING;

    @ApiProperty({
      example: "Note something"
    })
    @IsRequired()
    @IsString()
    @Column({
      type: "text"
    })
    note: string;


    @ApiProperty()
    @IsNumber()
    @Column()
    customerId: number;

    @IsRequired()
    billServices: CreateBillServiceDto[];
}
