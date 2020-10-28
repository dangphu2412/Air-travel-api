import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action, Override, ParsedBody, ParsedRequest, CrudRequest
} from "@nestjsx/crud";
import {Provider} from "src/common/entity";
import {ProviderService} from "./index.service";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {TJwtPayload} from "src/common/type";

@Crud({
  model: {
    type: Provider
  },
  routes: {
    exclude: ["createManyBase"],
    replaceOneBase: {
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
@ApiTags("Providers")
@Feature(ECrudFeature.PROVIDER)
@Controller("providers")
export class ProviderController implements CrudController<Provider> {
  constructor(public service: ProviderService) {}

  get base(): CrudController<Provider> {
    return this;
  }

  @Action(ECrudAction.CREATE)
  @GrantAccess()
  @Override("createOneBase")
  createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Provider,
    @CurrentUser() user: TJwtPayload
  ): Promise<Provider> {
    dto.userId = user.userId;
    return this.base.createOneBase(req, dto);
  };
}
