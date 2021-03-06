<code>

import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {
  Controller, Patch, Param, ParseIntPipe,
  Get, UseInterceptors, Delete, UseInterceptors
} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {T} from "src/common/entity";
import {TService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: Customer
  },
  routes: {
    exclude: ["createOneBase", "createManyBase", "replaceOneBase"],
    deleteOneBase: {
      decorators: [
        GrantAccess({
          type: "CUSTOMER",
          action: ECrudAction.DELETE
        })
      ]
    }
  }
})
@ApiTags("Ts")
@Feature(ECrudFeature.CUSTOMER)
@Controller("Ts")
export class TController implements CrudController<T> {
  constructor(public service: TService) {}

  get base(): CrudController<T> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  @UseInterceptors(SqlInterceptor)
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: User
  ): Promise<T> {
    this.service.getUserId(dto, user);
    await this.service.mapRelationKeysToEntities(dto, user);
    return this.base.createOneBase(req, dto);
  };

  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @Override("updateOneBase")
  @UseInterceptors(SqlInterceptor)
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: T,
    @CurrentUser() user: User
  ): Promise<T> {
    this.service.getUserId(dto, user);
    await this.service.mapRelationKeysToEntities(dto, user);
    return this.base.updateOneBase(req, dto);
  };

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

  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

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
</code>