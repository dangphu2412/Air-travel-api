import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature
} from "@nestjsx/crud";
import {City} from "src/common/entity";
import {CityService} from "./index.service";
import {ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: City
  },
  routes: {
    only: ["getManyBase"]
  }
})
@ApiTags("Cities")
@Feature(ECrudFeature.CITY)
@Controller("cities")
export class CityController implements CrudController<City> {
  constructor(public service: CityService) {}
}
