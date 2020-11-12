import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Bill, BillService as BillServiceEntity, User} from "src/common/entity";
import {BillService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {CreateBilLDto} from "src/common/dto/Bill";

@Crud({
  model: {
    type: Bill
  },
  routes: {
    exclude: ["updateOneBase", "replaceOneBase"],
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
    action: ECrudAction.CREATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateBilLDto,
    @CurrentUser() user: User
  ): Promise<Bill> {
    const customer = await this.service.getCustomer(dto.customerId);
    const entity: Bill = this.service.createEntity(dto, user, customer);
    const billServices: BillServiceEntity[] = await this.service.createBillServices(dto, entity);

    this.service.fillBillServices(entity, billServices);
    this.service.fillRemain(entity);
    return this.base.createOneBase(req, entity);
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
