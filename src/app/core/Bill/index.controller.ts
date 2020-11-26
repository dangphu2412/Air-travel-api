import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, UseInterceptors} from "@nestjs/common";
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
import {CreateBilLDto} from "src/common/dto/Bill";
import {getManager} from "typeorm";

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
  },
  query: {
    join: {
      billServices: {
        eager: true
      },
      user: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      },
      customer: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      }
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
  createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateBilLDto,
    @CurrentUser() user: User
  ): Promise<Bill> {
    return getManager().transaction(async transactionManager => {
      const customer = await this.service.getCustomer(dto.customerId);
      const entity: Bill = await this.service.createBill(dto, user, customer, transactionManager);

      await this.service.createBillServices(dto, entity, transactionManager);

      await this.service.updateBillRemain(entity, transactionManager);
      return entity;
    })
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
