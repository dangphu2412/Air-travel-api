import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, Patch, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Override, ParsedBody,
  ParsedRequest, CrudRequest, CrudRequestInterceptor
} from "@nestjsx/crud";
import {Provider, User} from "src/common/entity";
import {ProviderService} from "./index.service";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {ParseIntPipe} from "@nestjs/common/pipes/parse-int.pipe";
import {CrudSwaggerFindMany} from "src/common/decorators/crudSwagger.decorator";

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
    }
  },
  query: {
    join: {
      billInfos: {
        eager: false
      }
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
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Provider,
    @CurrentUser() user: User
  ): Promise<Provider> {
    dto.userId = user.id;
    return this.base.createOneBase(req, dto);
  };

  @ApiOperation({
    summary: "Restore one provider"
  })
  @Patch(":id/restore")
  @GrantAccess({
    action: ECrudAction.RESTORE
  })
  async restoreDestination(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @ApiOperation({
    summary: "Get soft deleted providers"
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @ApiOperation({
    summary: "Soft delete provider"
  })
  @CrudSwaggerFindMany()
  @Override("deleteOneBase")
  @GrantAccess({
    action: ECrudAction.SOFT_DEL
  })
  async softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.softDelete(id, user);
  }
}
