import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action
} from "@nestjsx/crud";
import {District} from "src/common/entity";
import {DistrictService} from "./index.service";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: District
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
@ApiTags("Districts")
@Feature(ECrudFeature.DISTRICT)
@Controller("districts")
export class DistrictController implements CrudController<District> {
  constructor(public service: DistrictService) {}
}
