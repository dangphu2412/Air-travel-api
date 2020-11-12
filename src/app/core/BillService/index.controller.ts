
import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature
} from "@nestjsx/crud";
import {BillService} from "src/common/entity";
import {BillServiceService} from "./index.service";
import {ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: BillService
  },
  routes: {
    only: ["getManyBase", "getOneBase"]
  }
})
@ApiTags("BillServices")
@Feature(ECrudFeature.BILL_SERVICE)
@Controller("billServices")
export class BillServiceController implements CrudController<BillService> {
  constructor(public service: BillServiceService) {}
}
