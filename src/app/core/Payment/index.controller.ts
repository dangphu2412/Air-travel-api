
import {ApiTags} from "@nestjs/swagger";
import {Controller, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, CrudRequest, Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {Payment, Role, User} from "src/common/entity";
import {PaymentService} from "./index.service";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import { GrantAccess, CurrentUser } from "src/common/decorators";
import { SqlInterceptor } from "src/common/interceptors/sql.interceptor";
import { CreatePaymentDto } from "src/common/dto/Payment";

@Crud({
  model: {
    type: Payment
  },
  routes: {
    only: ["getManyBase", "getOneBase", "createOneBase"]
  }
})
@ApiTags("Payments")
@Feature(ECrudFeature.BILL_SERVICE)
@Controller("payments")
export class PaymentController implements CrudController<Payment> {
  constructor(public service: PaymentService) {}

  get base(): CrudController<Payment> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  @UseInterceptors(SqlInterceptor)
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePaymentDto,
    @CurrentUser() user: User
  ): Promise<Payment> {
    const entity: Payment = this.service.createEntity(dto);

    await this.service.mapRelationKeysToEntities(entity, dto);

    this.service.getUserId(entity, user);
    this.service.syncRemainToBill(entity);
    this.service.validateCompleteBillAndSync(entity);

    await this.service.syncBillToDatabase(entity.bill);
    return this.base.createOneBase(req, entity);
  };
}
