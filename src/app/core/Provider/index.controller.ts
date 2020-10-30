import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Override, ParsedBody, ParsedRequest, CrudRequest
} from "@nestjsx/crud";
import {Provider, User} from "src/common/entity";
import {ProviderService} from "./index.service";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: Provider
  },
  routes: {
    exclude: ["createManyBase"],
    replaceOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.REPLACE
        })
      ]
    },
    deleteOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.DELETE
        })
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

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Provider,
    @CurrentUser() user: User
  ): Promise<Provider> {
    dto.userId = user.id;
    return this.base.createOneBase(req, dto);
  };
}
