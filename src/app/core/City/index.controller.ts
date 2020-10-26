import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action
} from "@nestjsx/crud";
import {City} from "src/common/entity";
import {CityService} from "./index.service";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: City
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
    createOneBase: {
      decorators: [
        Action(ECrudAction.CREATE),
        GrantAccess()
      ]
    },
    updateOneBase: {
      decorators: [
        Action(ECrudAction.REPLACE),
        GrantAccess()
      ]
    },
    deleteOneBase: {
      decorators: [
        Action(ECrudAction.DELETE),
        GrantAccess()
      ]
    }
  }
})
@ApiTags("Cities")
@Feature(ECrudFeature.CITY)
@Controller("cities")
export class CityController implements CrudController<City> {
  constructor(public service: CityService) {}
}
