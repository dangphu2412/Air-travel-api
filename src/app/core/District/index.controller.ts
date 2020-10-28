import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature
} from "@nestjsx/crud";
import {District} from "src/common/entity";
import {DistrictService} from "./index.service";
import {ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: District
  },
  routes: {
    only: ["getManyBase"]
  }
})
@ApiTags("Districts")
@Feature(ECrudFeature.DISTRICT)
@Controller("districts")
export class DistrictController implements CrudController<District> {
  constructor(public service: DistrictService) {}
}
