
import {ApiTags} from "@nestjs/swagger";
import {Controller, Query, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, CrudRequest, Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {BillInfo} from "src/common/entity";
import {BillInfoService} from "./index.service";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {GrantAccess} from "src/common/decorators";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {EBillInfoType} from "src/common/enums/billInfoType.enum";

@Crud({
  model: {
    type: BillInfo
  },
  routes: {
    only: ["getManyBase", "getOneBase", "createOneBase"]
  }
})
@ApiTags("BillInfos")
@Feature(ECrudFeature.BILL_INFO)
@Controller("billInfos")
export class BillInfoController implements CrudController<BillInfo> {
  constructor(public service: BillInfoService) {}

  get base(): CrudController<BillInfo> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  @UseInterceptors(SqlInterceptor)
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: BillInfo,
    @Query("type") type: EBillInfoType
  ): Promise<BillInfo> {
    await this.service.mapRelationKeysToEntities(dto, type);
    return this.base.createOneBase(req, dto);
  };
}
