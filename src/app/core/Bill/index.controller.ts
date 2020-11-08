
import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Bill, Customer} from "src/common/entity";
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
    exclude: ["replaceOneBase"],
    deleteOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.DELETE,
          type: "CUSTOMER"
        })
      ]
    }
  }
})
@ApiTags("Bills")
@Feature(ECrudFeature.BILL)
@Controller("bills")
export class BillController implements CrudController<Bill> {
  constructor(public service: BillService) {}

  get base(): CrudController<Bill> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE,
    type: "CUSTOMER"
  })
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Bill,
    @CurrentUser() user: Customer
  ): Promise<Bill> {
    this.service.getUserId(dto, user);
    return this.base.createOneBase(req, dto);
  };

  @Override("updateOneBase")
  @GrantAccess({
    action: ECrudAction.UPDATE,
    type: "CUSTOMER"
  })
  @UseInterceptors(SqlInterceptor)
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Bill,
    @CurrentUser() user: Customer
  ): Promise<Bill> {
    this.service.getUserId(dto, user);
    return this.base.updateOneBase(req, dto);
  };

  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  @GrantAccess({
    action: ECrudAction.READ,
    type: "CUSTOMER"
  })
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }
}
