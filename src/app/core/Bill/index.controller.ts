import {ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Post, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Bill, Customer, User} from "src/common/entity";
import {BillService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {CreateBillByUserDto} from "src/common/dto/Bill";
import {getManager} from "typeorm";
import {CreateBillByCustomerDto} from "src/common/dto/Bill/createBillByCustomer.dto";

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
    @ParsedBody() dto: CreateBillByUserDto,
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

  @GrantAccess({
    jwtOnly: true,
    type: "CUSTOMER"
  })
  @UseInterceptors(SqlInterceptor)
  @Post("customers")
  @ApiOperation({
    summary: "Create bill by customer"
  })
  @ApiBody({type: () => CreateBillByCustomerDto})
  createBillByCustomer(
    @Body() dto: CreateBillByCustomerDto,
    @CurrentUser() customer: Customer
  ): Promise<Bill> {
    return getManager().transaction(async transactionManager => {
      const entity: Bill = await this.service.createBill(dto, null, customer, transactionManager);

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
