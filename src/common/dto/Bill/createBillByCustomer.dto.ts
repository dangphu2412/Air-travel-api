import {BillStatus} from "src/common/enums";
import {CreateBilLDto} from "./bill.dto";

export class CreateBillByCustomerDto extends CreateBilLDto {
    status = BillStatus.CUSTOMER_PAYING;
}

