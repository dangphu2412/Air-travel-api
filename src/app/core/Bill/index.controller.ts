
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Bill, User} from "src/common/entity";
import {BillService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: Bill
  },
  routes: {
    exclude: ["createOneBase", "createManyBase", "replaceOneBase"],
    deleteOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.DELETE
        })
      ]
    }
  }
})
@ApiTags("Bills")
@Feature(ECrudFeature.BILL)
@Controller("Bills")
export class BillController implements CrudController<Bill> {
  constructor(public service: BillService) {}

  get base(): CrudController<Bill> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Bill,
    @CurrentUser() user: User
  ): Promise<Bill> {
    this.service.getUserId(dto, user);
    await this.service.mapRelationKeysToEntities(dto, user);
    return this.base.createOneBase(req, dto);
  };

  @Override("updateOneBase")
  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @UseInterceptors(SqlInterceptor)
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Bill,
    @CurrentUser() user: User
  ): Promise<Bill> {
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
